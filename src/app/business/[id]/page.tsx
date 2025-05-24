import BusinessPageClient from '@/components/BusinessPageClient/BusinessPageClient';

// Función para generar parámetros estáticos para la exportación
export async function generateStaticParams() {
  // Para la exportación estática, generamos IDs básicos
  // En un entorno real, esto se cargaría desde la base de datos o API
  const businessIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  
  return businessIds.map((id) => ({
    id: id,
  }));
}

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { id } = await params;
  
  return <BusinessPageClient businessId={id} />;
}
