import type { Metadata } from 'next';
import BackToLink from '../../components/BackToLink';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Mi Chatbot IA',
  description: 'Términos y condiciones de uso del asistente virtual UBE.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <BackToLink
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors mb-8"
        />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white border-b-2 border-red-500 pb-2 mb-8">
          Términos y Condiciones
        </h1>

        <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">
          Última actualización: Febrero 2025
        </p>

        <div className="space-y-8 text-gray-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Aceptación de los términos
            </h2>
            <p>
              Al acceder y utilizar este chatbot y asistente virtual («el Servicio»), usted acepta 
              quedar vinculado por los presentes Términos y Condiciones. Si no está de acuerdo con 
              alguna parte de los mismos, no debe utilizar el Servicio. El Servicio es proporcionado 
              en el marco de la Universidad de Educación UBE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Descripción del servicio
            </h2>
            <p>
              El Servicio consiste en un asistente virtual basado en inteligencia artificial que 
              ofrece respuestas e información de carácter orientativo. Las respuestas no constituyen 
              asesoramiento legal, académico ni oficial vinculante, salvo que se indique expresamente 
              lo contrario por la UBE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. Uso aceptable
            </h2>
            <p className="mb-3">
              Usted se compromete a utilizar el Servicio de forma lícita y respetuosa. En particular, 
              no debe:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar el Servicio para fines ilegales o no autorizados.</li>
              <li>Intentar acceder a sistemas, cuentas o datos ajenos sin autorización.</li>
              <li>Transmitir contenido ofensivo, difamatorio o que infrinja derechos de terceros.</li>
              <li>Sobrecargar o alterar el funcionamiento del Servicio de forma malintencionada.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Cuenta y acceso
            </h2>
            <p>
              El acceso al Servicio puede requerir identificación mediante los mecanismos habilitados 
              por la UBE (por ejemplo, credenciales institucionales o proveedores externos autorizados). 
              Usted es responsable de mantener la confidencialidad de sus credenciales y de todas las 
              actividades que se realicen con su cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              5. Propiedad intelectual y contenido
            </h2>
            <p>
              Los derechos sobre el Servicio, su diseño, marcas y materiales asociados pertenecen a 
              la UBE o a sus licenciantes. El contenido que usted envíe (mensajes, consultas) podrá 
              ser utilizado para el funcionamiento y la mejora del Servicio conforme a la Política de 
              Privacidad aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              6. Limitación de responsabilidad
            </h2>
            <p>
              El Servicio se ofrece «tal cual». La UBE no garantiza la exactitud, exhaustividad ni 
              actualidad de las respuestas del asistente. En la medida permitida por la ley, la UBE 
              no será responsable por daños indirectos, incidentales o consecuentes derivados del 
              uso o la imposibilidad de uso del Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              7. Modificaciones y terminación
            </h2>
            <p>
              La UBE se reserva el derecho de modificar, suspender o dar por terminado el Servicio 
              o estos Términos en cualquier momento. Los cambios en los Términos se notificarán mediante 
              publicación en esta página o por otros medios razonables. El uso continuado del Servicio 
              tras dichos cambios constituye la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              8. Ley aplicable y contacto
            </h2>
            <p>
              Estos Términos se rigen por la legislación aplicable en Ecuador. Para cualquier 
              consulta puede contactar a la Universidad de Educación UBE a través de los canales 
              oficiales en{' '}
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
