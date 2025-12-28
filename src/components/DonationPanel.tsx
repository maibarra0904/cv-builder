import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { registerPaymentWithBackend } from '../services/donation';
import useTranslation from '../i18n/useTranslation2';

type Props = { open: boolean; onClose: () => void };

const DonationPanel: React.FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const defaultAmount = '5';
  const [donationAmount, setDonationAmount] = useState<string>(defaultAmount);

  const rawClientId = (import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined) || '';
  const sandboxMode = (import.meta.env.VITE_PAYPAL_SANDBOX === 'true');
  const sandboxClientId = (import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX as string | undefined) || '';
  const paypalClientId = rawClientId || (sandboxMode ? sandboxClientId : '');

  return (
    <>
      <div className={`fixed top-0 right-0 w-full sm:w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-md border-l border-gray-200/50 h-[calc(100vh-104px)] overflow-y-auto transform transition-transform duration-300 z-20 shadow-2xl ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{ top: '104px' }}>
        <div className="p-4 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{t('donation.title', 'Donar')}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">{t('donation.description', 'Esta aplicación se mantiene gracias a aportes voluntarios. Puedes donar con PayPal.')}</p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                step={0.5}
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
                className="w-32 border rounded px-3 py-2"
              />
              <div className="text-sm text-gray-500">{t('donation.currencyLabel', 'USD')}</div>
            </div>
            <p className="text-sm text-gray-600">{t('donation.donateHint', 'Puedes disminuir o aumentar tu aportación según consideres. Recuerda que en PayPal puedes ingresar tu tarjeta de crédito de forma segura.')}</p>

            {paypalClientId ? (
              <PayPalScriptProvider options={{ 'client-id': paypalClientId, clientId: paypalClientId, intent: 'capture', currency: 'USD' }}>
                <div className="w-full">
                  <PayPalButtons
                    style={{ layout: 'horizontal', color: 'gold', shape: 'rect', label: 'paypal', height: 45 }}
                    forceReRender={[donationAmount]}
                    createOrder={(_data, actions) => {
                      const amountVal = (donationAmount && Number(donationAmount) > 0) ? Number(donationAmount).toFixed(2) : defaultAmount;
                      if (!actions || !actions.order || typeof actions.order.create !== 'function') {
                        return Promise.reject(new Error('PayPal actions.order.create no disponible'));
                      }

                      return actions.order.create({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'USD', value: String(amountVal) } }] });
                    }}
                    onApprove={async (_data, actions) => {
                      try {
                        if (!actions || !actions.order || typeof actions.order.capture !== 'function') {
                          console.error('PayPal actions.order.capture no disponible');
                          return;
                        }

                        const capture = await actions.order.capture();
                        const saleId = (capture && (capture.purchase_units?.[0]?.payments?.captures?.[0]?.id)) || capture?.id || _data.orderID || '';
                        registerPaymentWithBackend(saleId).catch(() => {});
                      } catch (err) {
                        console.error('PayPal capture error', err);
                      }
                    }}
                  />
                </div>
              </PayPalScriptProvider>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-sm">{t('donation.paypalNotConfigured', 'PayPal no configurado en el entorno. Puedes donar enviando un email a soporte o usar un enlace externo.')}</div>
            )}
          </div>
        </div>
      </div>
      {open && (
        <button
          className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-10 cursor-pointer border-0 p-0"
          style={{ top: '104px' }}
          onClick={onClose}
          aria-label={t('donation.title', 'Donar')}
        />
      )}
    </>
  );
};

export default DonationPanel;
