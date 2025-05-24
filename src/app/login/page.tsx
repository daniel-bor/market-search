"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    // Verificar si hay una URL de redirección en los parámetros
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirect') || '/';
    
    // Redirigir a la página solicitada o a la principal
    router.push(redirectTo);
  };

  if (isAuthenticated) {
    return null; // No mostrar nada mientras redirige
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-gray-600">
            Accede a tu cuenta de Buyloop
          </p>
        </div>
        
        <AuthForm 
          mode="login" 
          onSuccess={handleLoginSuccess}
        />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <button 
              onClick={() => router.push("/register")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
