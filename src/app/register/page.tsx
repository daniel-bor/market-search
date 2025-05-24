"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleRegisterSuccess = () => {
    // Redirigir a la página principal después del registro exitoso
    router.push("/");
  };

  if (isAuthenticated) {
    return null; // No mostrar nada mientras redirige
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h1>
          <p className="mt-2 text-gray-600">
            Únete a la comunidad Tienduki
          </p>
        </div>
        
        <AuthForm 
          mode="register" 
          onSuccess={handleRegisterSuccess}
        />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <button 
              onClick={() => router.push("/login")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
