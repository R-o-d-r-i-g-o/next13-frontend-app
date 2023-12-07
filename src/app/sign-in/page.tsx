"use client"

import React from "react";
import { signIn } from "next-auth/react";

export default function Home() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const result = await signIn('credentials', {
        email: username,
        password,
        redirect: true,
        callbackUrl: '/'
      });

      console.log('erro', result?.error);
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Bem-vindo de volta!</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Nome de Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Não tem uma conta? <a href="#" className="text-blue-500 hover:underline">Registre-se aqui</a>.
        </p>
      </div>
    </div>
  )
}
