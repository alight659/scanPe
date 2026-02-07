import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/theme-provider";

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
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
			>
				<ScrollView
					className="flex-1"
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
						paddingBottom: 100,
					}}
					showsVerticalScrollIndicator={true}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
					contentInsetAdjustmentBehavior="automatic"
				>
					<View className="px-6">
						{/* Logo section */}
						<View className="mb-8 items-center">
							<Image
								style={{
									width: 170,
									height: 170,
								}}
								source="https://qaqtvoxob8zyd7wl.public.blob.vercel-storage.com/logo.png"
								placeholder={{ blurhash }}
								contentFit="contain"
								transition={500}
								onError={(error) => console.log("Image load error:", error)}
							/>
						</View>

						{/* Welcome section */}
						<View className="mb-6 items-center">
							<Text
								className="mb-2 font-bold text-2xl text-[#D1D5DC]"
								style={{ letterSpacing: -0.5 }}
							>
								{isSignUp ? "Create Account" : "Welcome Back"}
							</Text>
							<Text
								className="px-4 text-center text-sm leading-5"
								style={{ color: theme.text, opacity: 0.6 }}
							>
								{isSignUp
									? "Sign up to get started with scanPe"
									: "Sign in to continue to your account"}
							</Text>
						</View>

						{/* Form section */}
						<View className="mb-6">{isSignUp ? <SignUp /> : <SignIn />}</View>

						{/* Footer */}
						<View className="flex-row items-center justify-center py-4">
							<Text
								className="text-sm"
								style={{ color: theme.text, opacity: 0.7 }}
							>
								{isSignUp
									? "Already have an account? "
									: "Don't have an account? "}
							</Text>
							<TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
								<Text
									className="font-bold text-sm"
									style={{ color: theme.primary }}
								>
									{isSignUp ? "Log In" : "Sign Up"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</Container>
	);
}
