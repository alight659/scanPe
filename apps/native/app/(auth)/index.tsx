import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function AuthScreen() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
	const { data: session } = authClient.useSession();
	const [isSignUp, setIsSignUp] = useState(false);

	const blurhash =
		"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

	if (session?.user) {
		return <Redirect href="/(app)" />;
	}

	return (
		<Container>
			<ScrollView
				className="flex-1"
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex-1 justify-between px-6 pt-16 pb-8">
					<View className="mb-8 items-center">
						<View
							className="h-50 w-50 items-center justify-center"
							style={{
								backgroundColor: "rgba(99, 102, 241, 0.08)",
								borderRadius: 200,
								shadowColor: "#6366f1",
								shadowOffset: {
									width: 0,
									height: 4,
								},
								shadowOpacity: 0.12,
								shadowRadius: 12,
								elevation: 6,
							}}
						>
							<Image
								style={{
									width: 150,
									height: 150,
								}}
								source="https://qaqtvoxob8zyd7wl.public.blob.vercel-storage.com/logo.png"
								placeholder={{ blurhash }}
								contentFit="contain"
								transition={500}
								onError={(error) => console.log("Image load error:", error)}
							/>
						</View>
					</View>

					<View className="mb-8 items-center">
						<Text
							className="mb-2.5 font-bold text-[32px]"
							style={{ color: theme.text, letterSpacing: -0.5 }}
						>
							{isSignUp ? "Create Account" : "Welcome Back"}
						</Text>
						<Text
							className="px-5 text-center text-[15px] leading-[22px]"
							style={{ color: theme.text, opacity: 0.6 }}
						>
							{isSignUp
								? "Sign up to get started with scanPe"
								: "Sign in to continue to your account"}
						</Text>
					</View>

					<View className="max-h-[400px] flex-1 justify-center">
						{isSignUp ? <SignUp /> : <SignIn />}
					</View>

					<View className="flex-row items-center justify-center pt-6">
						<Text
							className="text-[15px]"
							style={{ color: theme.text, opacity: 0.7 }}
						>
							{isSignUp
								? "Already have an account? "
								: "Don't have an account? "}
						</Text>
						<TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
							<Text
								className="font-bold text-[15px]"
								style={{ color: theme.primary }}
							>
								{isSignUp ? "Log In" : "Sign Up"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</Container>
	);
}
