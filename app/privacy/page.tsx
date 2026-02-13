import type { Metadata } from 'next';
import BackToLink from '../../components/BackToLink';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Mi Chatbot IA',
  description: 'Política de privacidad del asistente virtual UBE.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <BackToLink
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors mb-8"
        />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white border-b-2 border-red-500 pb-2 mb-8">
          Política de Privacidad
        </h1>

        <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">
          Última actualización: Febrero 2025
        </p>

        <div className="space-y-8 text-gray-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Responsable del tratamiento
            </h2>
            <p>
              El presente chatbot y asistente virtual es operado en el marco de la Universidad de 
              Educación UBE. Los datos personales que usted proporcione serán tratados de conformidad 
              con la normativa aplicable en materia de protección de datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Datos que recogemos
            </h2>
            <p className="mb-3">
              Podemos recopilar y procesar la siguiente información en relación con el uso del servicio:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Datos de identificación y autenticación (correo electrónico, nombre, proveedor de inicio de sesión).</li>
              <li>Contenido de las conversaciones con el asistente para prestar el servicio y mejorar la experiencia.</li>
              <li>Datos técnicos (dirección IP, tipo de navegador, dispositivo) cuando sea necesario para el funcionamiento o la seguridad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. Finalidad del tratamiento
            </h2>
            <p>
              Sus datos se utilizan para permitir el acceso al chatbot, personalizar las respuestas, 
              mantener la seguridad del servicio y, cuando la normativa lo permita, para análisis 
              y mejora del asistente. No vendemos sus datos personales a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Base legal y conservación
            </h2>
            <p>
              El tratamiento se basa en la ejecución del servicio solicitado, el consentimiento cuando 
              corresponda y el interés legítimo en la mejora y seguridad del sistema. Conservaremos 
              sus datos durante el tiempo necesario para cumplir estas finalidades o lo que exija la ley.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              5. Sus derechos
            </h2>
            <p className="mb-3">
              Puede ejercer los derechos de acceso, rectificación, supresión, limitación del tratamiento, 
              portabilidad y oposición, así como reclamar ante la autoridad de control, conforme a la 
              legislación aplicable. Para ello puede contactar a través de los canales oficiales de la UBE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              6. Cambios
            </h2>
            <p>
              Nos reservamos el derecho de actualizar esta política. Los cambios relevantes se 
              comunicarán mediante aviso en la aplicación o por otros medios adecuados. Le recomendamos 
              revisar esta página periódicamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              7. Contacto
            </h2>
            <p>
              Para cualquier consulta sobre esta política de privacidad o el tratamiento de sus datos, 
              puede dirigirse a la Universidad de Educación UBE a través de los canales de contacto 
              oficiales publicados en{' '}
              <a
                href="https://ube.edu.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 dark:text-red-400 underline hover:no-underline"
              >
                ube.edu.ec
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-slate-700">
          <BackToLink
            className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-medium hover:underline"
          />
        </div>
      </div>
    </div>
  );
}
