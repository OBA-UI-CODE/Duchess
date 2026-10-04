/* eslint-disable jsx-a11y/alt-text -- React Native Image uses accessibilityLabel, not the DOM alt prop. */
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ActivityIndicator, AppState, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Sora_600SemiBold } from "@expo-google-fonts/sora/600SemiBold";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_600SemiBold } from "@expo-google-fonts/dm-sans/600SemiBold";
import { isSupabaseConfigured, supabase } from "./src/supabase";
import { colors, fonts } from "./src/theme";
import { formatNaira, mapProduct, type CartItem, type Department, type Product } from "./src/types";
import shoppingHero from "./assets/duchess-shopping-hero-v2.png";

WebBrowser.maybeCompleteAuthSession();

type Tab = "shop" | "cart" | "account";
const siteUrl = (process.env.EXPO_PUBLIC_SITE_URL ?? "https://duchess-eight.vercel.app").replace(/\/$/, "");
const imageUri = (value: string) => value.startsWith("http") ? value : `${siteUrl}${value}`;

export default function App({ routeTab = "shop" }: { routeTab?: Tab }) {
  const [fontsLoaded] = useFonts({ Sora_600SemiBold, DMSans_400Regular, DMSans_600SemiBold });
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const tab = routeTab;
  const [department, setDepartment] = useState<Department | "all">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, value) => {
      setSession(value);
      if (!value) setCart([]);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const loadProducts = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase.from("products")
      .select("id,slug,name,department,category,description,price_kobo,image_url,badge,options,stock_quantity")
      .eq("is_active", true).order("sort_order");
    if (error) setMessage("We could not load the collection. Pull to try again.");
    else setProducts((data ?? []).map((row) => mapProduct(row)));
    setLoading(false);
  }, []);

  const userId = session?.user.id;
  const loadCart = useCallback(async () => {
    if (!userId) return;
    setSyncing(true);
    const { data, error } = await supabase.from("cart_items")
      .select("quantity,selected_option,products(*)").eq("user_id", userId);
    if (error) setMessage("Your bag could not be refreshed.");
    else {
      setCart((data ?? []).flatMap((row) => {
        const product = row.products as unknown as Record<string, unknown> | null;
        return product ? [{ product: mapProduct(product), quantity: Number(row.quantity), option: String(row.selected_option) }] : [];
      }));
      setMessage("");
    }
    setSyncing(false);
  }, [userId]);

  useEffect(() => { queueMicrotask(() => void loadProducts()); }, [loadProducts]);
  useEffect(() => { if (userId) queueMicrotask(() => void loadCart()); }, [userId, loadCart]);
  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel(`mobile-cart-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${userId}` }, () => { void loadCart(); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [userId, loadCart]);
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => void loadCart(), 4000);
    const foreground = AppState.addEventListener("change", (state) => {
      if (state === "active") void loadCart();
    });
    return () => { clearInterval(interval); foreground.remove(); };
  }, [userId, loadCart]);

  const updateCart = useCallback(async (product: Product, option: string, quantity: number) => {
    const userId = session?.user.id;
    if (!userId) { setSelected(null); setAuthOpen(true); return; }
    const previous = cart;
    setCart((current) => {
      const rest = current.filter((item) => item.product.id !== product.id || item.option !== option);
      return quantity > 0 ? [...rest, { product, option, quantity }] : rest;
    });
    const result = quantity > 0
      ? await supabase.from("cart_items").upsert({ user_id: userId, product_id: product.id, selected_option: option, quantity }, { onConflict: "user_id,product_id,selected_option" })
      : await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", product.id).eq("selected_option", option);
    if (result.error) { setCart(previous); setMessage("That change did not save. Please try again."); }
  }, [cart, session?.user.id]);

  const visible = department === "all" ? products : products.filter((item) => item.department === department);
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.priceKobo * item.quantity, 0);

  if (!fontsLoaded || !ready) return <View style={styles.center}><ActivityIndicator color={colors.purple800} /></View>;
  if (!isSupabaseConfigured) return <ConfigurationScreen />;

  return <SafeAreaView style={styles.safe}>
    <StatusBar style="dark" />
    <Header count={count} syncing={syncing} />
    {message ? <Text accessibilityLiveRegion="polite" style={styles.notice}>{message}</Text> : null}
    {tab === "shop" ? <Shop products={visible} department={department} loading={loading} onDepartment={setDepartment} onRefresh={loadProducts} onSelect={setSelected} /> : null}
    {tab === "cart" ? <Cart cart={cart} subtotal={subtotal} updateCart={updateCart} /> : null}
    {tab === "account" ? <Account session={session} openAuth={() => setAuthOpen(true)} signedOut={() => router.replace("/")} /> : null}
    <Tabs active={tab} count={count} />
    <ProductSheet key={selected?.id ?? "closed"} product={selected} cart={cart} close={() => setSelected(null)} add={updateCart} />
    <AuthSheet open={authOpen} close={() => setAuthOpen(false)} />
  </SafeAreaView>;
}

function Header({ count, syncing }: { count: number; syncing: boolean }) {
  return <View style={styles.header}><View><Text style={styles.wordmark}>Duchess</Text><Text style={styles.caption}>{syncing ? "Syncing your bag…" : "Hair, care & beauty"}</Text></View><View accessibilityLabel={`${count} items in bag`} style={styles.cartCounter}><Ionicons name="bag-handle-outline" size={24} color={colors.white} /><View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{count}</Text></View></View></View>;
}

function Shop({ products, department, loading, onDepartment, onRefresh, onSelect }: { products: Product[]; department: Department | "all"; loading: boolean; onDepartment: (value: Department | "all") => void; onRefresh: () => Promise<void>; onSelect: (product: Product) => void }) {
  return <FlatList data={products} keyExtractor={(item) => item.id} numColumns={2} columnWrapperStyle={styles.gridRow} contentContainerStyle={styles.list} refreshing={loading} onRefresh={() => void onRefresh()}
    ListHeaderComponent={<><LinearGradient colors={[colors.purple950, colors.purple700]} style={styles.hero}><Image accessibilityLabel="A happy Duchess shopper carrying shopping bags" source={shoppingHero} resizeMode="contain" style={styles.heroImage} /><View style={styles.heroCopy}><Text style={styles.heroKicker}>THE DUCHESS COLLECTION</Text><Text style={styles.heroTitle}>Every expression of you.</Text><Text style={styles.heroBody}>Polished hair, thoughtful care and beauty essentials.</Text></View></LinearGradient><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{(["all", "hair", "cosmetics"] as const).map((value) => <Pressable key={value} onPress={() => onDepartment(value)} style={[styles.filter, department === value && styles.filterActive]}><Text style={[styles.filterText, department === value && styles.filterTextActive]}>{value === "all" ? "All products" : value === "hair" ? "Hair | Accessories" : "Care & Cosmetics"}</Text></Pressable>)}</ScrollView><Text style={styles.sectionTitle}>{department === "all" ? "The collection" : department === "hair" ? "Hair | Accessories" : "Care & Cosmetics"}</Text></>}
    renderItem={({ item }) => <Pressable onPress={() => onSelect(item)} style={styles.productCard}><View style={styles.imageWrap}><Image source={{ uri: imageUri(item.image) }} style={styles.image} />{item.badge ? <Text style={styles.badge}>{item.badge}</Text> : null}</View><Text numberOfLines={1} style={styles.eyebrow}>{item.category}</Text><Text numberOfLines={2} style={styles.productName}>{item.name}</Text><Text style={styles.price}>{formatNaira(item.priceKobo)}</Text></Pressable>}
    ListEmptyComponent={!loading ? <Text style={styles.empty}>No products are available yet.</Text> : null} />;
}

function ProductSheet({ product, cart, close, add }: { product: Product | null; cart: CartItem[]; close: () => void; add: (product: Product, option: string, quantity: number) => Promise<void> }) {
  const [option, setOption] = useState(product?.options[0] ?? "Standard");
  if (!product) return null;
  const existing = cart.find((item) => item.product.id === product.id && item.option === option);
  return <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={close}><SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.sheet}><Pressable onPress={close} style={styles.close}><Text style={styles.link}>Close</Text></Pressable><Image source={{ uri: imageUri(product.image) }} style={styles.detailImage} /><Text style={styles.eyebrow}>{product.category}</Text><Text style={styles.detailTitle}>{product.name}</Text><Text style={styles.detailPrice}>{formatNaira(product.priceKobo)}</Text><Text style={styles.body}>{product.description}</Text>{product.options.length ? <><Text style={styles.label}>Choose an option</Text><View style={styles.options}>{product.options.map((value) => <Pressable key={value} onPress={() => setOption(value)} style={[styles.option, option === value && styles.optionActive]}><Text style={[styles.optionText, option === value && styles.optionTextActive]}>{value}</Text></Pressable>)}</View></> : null}<Pressable disabled={product.stock < 1} onPress={() => { void add(product, option, (existing?.quantity ?? 0) + 1); close(); }} style={[styles.primary, product.stock < 1 && styles.disabled]}><Text style={styles.primaryText}>{product.stock < 1 ? "Unavailable" : existing ? "Add another to bag" : "Add to bag"}</Text></Pressable></ScrollView></SafeAreaView></Modal>;
}

function Cart({ cart, subtotal, updateCart }: { cart: CartItem[]; subtotal: number; updateCart: (product: Product, option: string, quantity: number) => Promise<void> }) {
  return <ScrollView contentContainerStyle={styles.page}><Text style={styles.pageKicker}>YOUR BAG</Text><Text style={styles.pageTitle}>Ready when you are.</Text>{!cart.length ? <Text style={styles.empty}>Your bag is empty. Add something from the collection to see it here and on the Duchess website.</Text> : cart.map((item) => <View key={`${item.product.id}-${item.option}`} style={styles.cartLine}><Image source={{ uri: imageUri(item.product.image) }} style={styles.cartImage} /><View style={styles.cartCopy}><Text style={styles.cartName}>{item.product.name}</Text><Text style={styles.muted}>{item.option}</Text><Text style={styles.price}>{formatNaira(item.product.priceKobo * item.quantity)}</Text><View style={styles.quantity}><Pressable accessibilityLabel="Decrease quantity" onPress={() => void updateCart(item.product, item.option, item.quantity - 1)} style={styles.quantityButton}><Text style={styles.quantityText}>−</Text></Pressable><Text style={styles.quantityValue}>{item.quantity}</Text><Pressable accessibilityLabel="Increase quantity" onPress={() => void updateCart(item.product, item.option, Math.min(20, item.quantity + 1))} style={styles.quantityButton}><Text style={styles.quantityText}>+</Text></Pressable></View></View></View>)}{cart.length ? <View style={styles.total}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>{formatNaira(subtotal)}</Text></View> : null}</ScrollView>;
}

function Account({ session, openAuth, signedOut }: { session: Session | null; openAuth: () => void; signedOut: () => void }) {
  if (!session) return <View style={styles.page}><Text style={styles.pageKicker}>ACCOUNT</Text><Text style={styles.pageTitle}>Take Duchess with you.</Text><Text style={styles.body}>Sign in with the same account you use on the website. Your bag will stay in step across both.</Text><Pressable onPress={openAuth} style={styles.primary}><Text style={styles.primaryText}>Sign in or create account</Text></Pressable></View>;
  return <View style={styles.page}><Text style={styles.pageKicker}>ACCOUNT</Text><Text style={styles.pageTitle}>Welcome back.</Text><Text style={styles.body}>{session.user.email}</Text><Text style={styles.syncCard}>Your bag is connected and listening for changes from your other devices.</Text><Pressable onPress={() => void supabase.auth.signOut().then(signedOut)} style={styles.secondary}><Text style={styles.secondaryText}>Sign out</Text></Pressable></View>;
}

function AuthSheet({ open, close }: { open: boolean; close: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function submit() {
    setBusy(true); setMessage("");
    const result = mode === "signin" ? await supabase.auth.signInWithPassword({ email: email.trim(), password }) : await supabase.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (mode === "signup" && !result.data.session) setMessage("Check your email to confirm your account, then sign in.");
    else { setEmail(""); setPassword(""); close(); }
  }
  async function signInWithGoogle() {
    setBusy(true); setMessage("");
    if (Constants.appOwnership === "expo") {
      setMessage("Google sign-in requires the installable Duchess test app. Expo Go cannot securely return Google sign-in to Duchess.");
      setBusy(false);
      return;
    }
    const redirectTo = AuthSession.makeRedirectUri({ native: "duchess://auth/callback" });
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo, skipBrowserRedirect: true } });
    if (error || !data.url) { setMessage(error?.message ?? "Google sign-in could not start."); setBusy(false); return; }
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === "success") {
      const callback = new URL(result.url.replace("#", "?"));
      const accessToken = callback.searchParams.get("access_token");
      const refreshToken = callback.searchParams.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (!sessionError) { close(); setBusy(false); return; }
        setMessage(sessionError.message);
      } else setMessage("Google sign-in did not return a session. Check the redirect settings.");
    }
    setBusy(false);
  }
  const invalid = busy || !email || password.length < 6;
  return <Modal visible={open} transparent animationType="fade" onRequestClose={close}><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.backdrop}><View style={styles.authCard}><Pressable onPress={close} style={styles.close}><Text style={styles.link}>Close</Text></Pressable><Text style={styles.pageKicker}>{mode === "signin" ? "WELCOME BACK" : "JOIN DUCHESS"}</Text><Text style={styles.authTitle}>{mode === "signin" ? "Sign in" : "Create your account"}</Text><Pressable disabled={busy} onPress={() => void signInWithGoogle()} style={styles.googleButton}><Ionicons name="logo-google" size={20} color={colors.ink} /><Text style={styles.googleButtonText}>Continue with Google</Text></Pressable><View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>or use email</Text><View style={styles.dividerLine} /></View><Text style={styles.inputLabel}>Email address</Text><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} /><Text style={styles.inputLabel}>Password</Text><TextInput autoCapitalize="none" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />{message ? <Text accessibilityLiveRegion="polite" style={styles.formMessage}>{message}</Text> : null}<Pressable disabled={invalid} onPress={() => void submit()} style={[styles.primary, invalid && styles.disabled]}><Text style={styles.primaryText}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</Text></Pressable><Pressable onPress={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }} style={styles.switch}><Text style={styles.link}>{mode === "signin" ? "New to Duchess? Create an account" : "Already have an account? Sign in"}</Text></Pressable></View></KeyboardAvoidingView></Modal>;
}

function Tabs({ active, count }: { active: Tab; count: number }) {
  const icons = { shop: ["storefront-outline", "storefront"], cart: ["bag-handle-outline", "bag-handle"], account: ["person-outline", "person"] } as const;
  return <View style={styles.tabs}>{(["shop", "cart", "account"] as Tab[]).map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: active === value }} onPress={() => router.replace(value === "shop" ? "/" : `/${value}`)} style={styles.tab}><View><Ionicons name={icons[value][active === value ? 1 : 0]} size={25} color={active === value ? colors.purple800 : colors.muted} />{value === "cart" && count ? <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{count}</Text></View> : null}</View><Text style={[styles.tabText, active === value && styles.tabActive]}>{value === "shop" ? "Shop" : value === "cart" ? "Bag" : "Account"}</Text></Pressable>)}</View>;
}

function ConfigurationScreen() {
  return <SafeAreaView style={styles.safe}><View style={styles.page}><Text style={styles.wordmark}>Duchess</Text><Text style={styles.pageTitle}>Connect the mobile app.</Text><Text style={styles.body}>Copy .env.example to .env and add the same Supabase URL and publishable key used by the Duchess website.</Text><Text selectable style={styles.code}>EXPO_PUBLIC_SUPABASE_URL{`\n`}EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY</Text></View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.cream},center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.cream},header:{minHeight:72,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},wordmark:{fontFamily:fonts.display,fontSize:28,letterSpacing:-1.5,color:colors.purple900},caption:{fontFamily:fonts.body,fontSize:11,color:colors.muted},cartCounter:{width:48,height:48,borderRadius:999,alignItems:"center",justifyContent:"center",backgroundColor:colors.purple900},cartBadge:{position:"absolute",right:-2,top:-3,minWidth:20,height:20,paddingHorizontal:4,borderRadius:10,alignItems:"center",justifyContent:"center",backgroundColor:"#d65c7b",borderWidth:2,borderColor:colors.cream},cartBadgeText:{color:colors.white,fontFamily:fonts.bodyMedium,fontSize:10},notice:{padding:9,paddingHorizontal:20,color:colors.danger,backgroundColor:"#fff0f2",fontFamily:fonts.body,fontSize:13},
  list:{paddingBottom:110},gridRow:{gap:12,paddingHorizontal:20},hero:{margin:20,marginBottom:16,padding:24,minHeight:250,borderRadius:18,justifyContent:"flex-end",overflow:"hidden"},heroCopy:{width:"60%",zIndex:2},heroImage:{position:"absolute",right:-12,bottom:-18,width:"60%",height:"108%",opacity:1,zIndex:1},heroKicker:{color:"#ead8ef",fontFamily:fonts.bodyMedium,fontSize:10,letterSpacing:1.4},heroTitle:{marginTop:10,color:colors.white,fontFamily:fonts.display,fontSize:29,lineHeight:33,letterSpacing:-1.2},heroBody:{marginTop:10,color:"#eadfeb",fontFamily:fonts.body,fontSize:13,lineHeight:19},filters:{paddingHorizontal:20,gap:8,paddingBottom:24},filter:{minHeight:44,paddingHorizontal:16,borderWidth:1,borderColor:colors.line,borderRadius:999,alignItems:"center",justifyContent:"center",backgroundColor:colors.white},filterActive:{borderColor:colors.purple900,backgroundColor:colors.purple900},filterText:{fontFamily:fonts.bodyMedium,fontSize:13},filterTextActive:{color:colors.white},sectionTitle:{marginHorizontal:20,marginBottom:20,fontFamily:fonts.display,fontSize:27,letterSpacing:-1},
  productCard:{flex:1,minWidth:0,marginBottom:24},imageWrap:{aspectRatio:.8,borderRadius:12,overflow:"hidden",backgroundColor:colors.purple100},image:{width:"100%",height:"100%"},badge:{position:"absolute",left:8,top:8,paddingHorizontal:9,paddingVertical:5,borderRadius:999,backgroundColor:colors.cream,color:colors.purple900,fontFamily:fonts.bodyMedium,fontSize:10},eyebrow:{marginTop:11,color:colors.muted,fontFamily:fonts.bodyMedium,fontSize:10,letterSpacing:.5,textTransform:"uppercase"},productName:{minHeight:42,marginTop:4,fontFamily:fonts.display,fontSize:15,lineHeight:20},price:{marginTop:5,color:colors.purple900,fontFamily:fonts.bodyMedium,fontSize:15},empty:{margin:20,color:colors.muted,fontFamily:fonts.body,fontSize:16,lineHeight:25},
  page:{flexGrow:1,padding:20,paddingBottom:110},pageKicker:{marginTop:12,color:colors.purple700,fontFamily:fonts.bodyMedium,fontSize:11,letterSpacing:1.5},pageTitle:{marginTop:8,marginBottom:24,color:colors.purple950,fontFamily:fonts.display,fontSize:36,lineHeight:42,letterSpacing:-1.6},body:{color:colors.muted,fontFamily:fonts.body,fontSize:16,lineHeight:25},muted:{marginTop:4,color:colors.muted,fontFamily:fonts.body,fontSize:13},cartLine:{flexDirection:"row",gap:16,paddingVertical:16,borderBottomWidth:1,borderBottomColor:colors.line},cartImage:{width:96,height:120,borderRadius:12,backgroundColor:colors.purple100},cartCopy:{flex:1},cartName:{fontFamily:fonts.display,fontSize:17,lineHeight:22},quantity:{marginTop:13,flexDirection:"row",alignItems:"center",gap:12},quantityButton:{width:44,height:44,borderRadius:999,borderWidth:1,borderColor:colors.line,alignItems:"center",justifyContent:"center",backgroundColor:colors.white},quantityText:{fontFamily:fonts.bodyMedium,fontSize:21},quantityValue:{minWidth:20,textAlign:"center",fontFamily:fonts.bodyMedium},total:{marginTop:24,paddingTop:24,borderTopWidth:2,borderTopColor:colors.purple900,flexDirection:"row",justifyContent:"space-between"},totalLabel:{fontFamily:fonts.bodyMedium,fontSize:17},totalValue:{fontFamily:fonts.display,fontSize:22,color:colors.purple900},
  primary:{minHeight:52,marginTop:24,paddingHorizontal:20,borderRadius:12,alignItems:"center",justifyContent:"center",backgroundColor:colors.purple800},primaryText:{color:colors.white,fontFamily:fonts.bodyMedium,fontSize:16},secondary:{minHeight:52,marginTop:24,borderRadius:12,borderWidth:1,borderColor:colors.purple800,alignItems:"center",justifyContent:"center"},secondaryText:{color:colors.purple800,fontFamily:fonts.bodyMedium,fontSize:16},disabled:{opacity:.5},syncCard:{marginTop:24,padding:16,borderRadius:12,color:colors.success,backgroundColor:"#eaf7f1",fontFamily:fonts.body,lineHeight:21},
  tabs:{position:"absolute",left:12,right:12,bottom:10,minHeight:72,paddingBottom:Platform.OS==="ios"?8:2,flexDirection:"row",borderWidth:1,borderColor:colors.line,borderRadius:22,backgroundColor:colors.white,shadowColor:colors.purple950,shadowOpacity:.12,shadowRadius:18,shadowOffset:{width:0,height:6},elevation:8},tab:{flex:1,minHeight:62,alignItems:"center",justifyContent:"center",gap:3},tabText:{color:colors.muted,fontFamily:fonts.bodyMedium,fontSize:14},tabActive:{color:colors.purple800},tabBadge:{position:"absolute",right:-11,top:-7,minWidth:18,height:18,paddingHorizontal:4,borderRadius:9,alignItems:"center",justifyContent:"center",backgroundColor:"#d65c7b"},tabBadgeText:{color:colors.white,fontFamily:fonts.bodyMedium,fontSize:9},sheet:{padding:20,paddingBottom:50},close:{alignSelf:"flex-end",minHeight:44,justifyContent:"center"},link:{color:colors.purple800,fontFamily:fonts.bodyMedium},detailImage:{width:"100%",aspectRatio:.9,borderRadius:18,backgroundColor:colors.purple100},detailTitle:{marginTop:7,fontFamily:fonts.display,fontSize:31,lineHeight:37,letterSpacing:-1.3},detailPrice:{marginVertical:12,color:colors.purple900,fontFamily:fonts.display,fontSize:22},label:{marginTop:24,marginBottom:12,fontFamily:fonts.bodyMedium,fontSize:14},options:{flexDirection:"row",flexWrap:"wrap",gap:8},option:{minHeight:44,paddingHorizontal:16,borderWidth:1,borderColor:colors.line,borderRadius:999,justifyContent:"center",backgroundColor:colors.white},optionActive:{borderColor:colors.purple900,backgroundColor:colors.purple900},optionText:{fontFamily:fonts.bodyMedium,fontSize:13},optionTextActive:{color:colors.white},
  backdrop:{flex:1,padding:20,justifyContent:"center",backgroundColor:"rgba(36,16,47,.58)"},authCard:{padding:24,borderRadius:18,backgroundColor:colors.cream},authTitle:{marginTop:8,marginBottom:24,fontFamily:fonts.display,fontSize:30,letterSpacing:-1.2},googleButton:{minHeight:52,borderWidth:1,borderColor:"#cfc7d0",borderRadius:12,backgroundColor:colors.white,flexDirection:"row",gap:10,alignItems:"center",justifyContent:"center"},googleButtonText:{fontFamily:fonts.bodyMedium,fontSize:15,color:colors.ink},divider:{marginVertical:18,flexDirection:"row",alignItems:"center",gap:10},dividerLine:{height:1,flex:1,backgroundColor:colors.line},dividerText:{fontFamily:fonts.body,fontSize:12,color:colors.muted},inputLabel:{marginBottom:8,fontFamily:fonts.bodyMedium,fontSize:13},input:{height:52,marginBottom:16,paddingHorizontal:16,borderWidth:1,borderColor:"#cfc7d0",borderRadius:12,backgroundColor:colors.white,color:colors.ink,fontFamily:fonts.body,fontSize:16},formMessage:{color:colors.danger,fontFamily:fonts.body,fontSize:13,lineHeight:19},switch:{minHeight:48,marginTop:12,alignItems:"center",justifyContent:"center"},code:{marginTop:24,padding:16,borderRadius:12,backgroundColor:colors.purple950,color:colors.white,fontFamily:Platform.select({ios:"Menlo",android:"monospace"}),lineHeight:22},
});
