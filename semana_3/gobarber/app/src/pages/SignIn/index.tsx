import React, { useCallback, useRef } from "react";
import {
  Alert,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import useAuthContext from "../../contexts/AuthContext";

import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";

import * as Yup from "yup";

import Icon from "react-native-vector-icons/Feather";

import Input from "../../components/Input";
import Button from "../../components/Button";

import logoImg from "../../assets/logo.png";

import getValidationErrors from "../../utils/getValidationErrors";

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
  TextInput,
} from "./styles";

interface SignInFormData {
  email: string;
  password: string;
}
const SignIn: React.FC = () => {
  const { signIn, user } = useAuthContext();
  const navigation = useNavigation();
  const passwordRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  const handleSignIn = useCallback(async (data: SignInFormData): Promise<
    void
  > => {
    formRef.current?.setErrors({});
    const schema = Yup.object().shape({
      email: Yup.string()
        .required("O email é obrigatório")
        .email("Digite um email válido"),
      password: Yup.string().required("A senha é obrigatória"),
    });

    try {
      await schema.validate(data, {
        abortEarly: false,
      });
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
        return;
      }

      Alert.alert("Erro ao autenticar", "Email ou senha inválidos");
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form
              onSubmit={handleSignIn}
              ref={formRef}
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />
              <Input
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry={true}
                ref={passwordRef}
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>

              <ForgotPassword onPress={() => {}}>
                <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
              </ForgotPassword>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
