import { useCV } from '../../hooks/useCV';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import useTranslation from '../../i18n/useTranslation';

export function PersonalDataForm() {
  const { state, updatePersonalData } = useCV();
  const { personalData } = state.cvData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleInputChange = (field: keyof typeof personalData, value: string) => {
    updatePersonalData({ [field]: value });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {personalData.photo ? (
            <img
              src={personalData.photo}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}

          {personalData.photo ? (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                aria-label="Subir otra foto"
              >
                <Upload className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleInputChange('photo', '')}
                className="absolute bottom-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                aria-label="Eliminar foto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <p className="text-sm text-gray-500 text-center">
          {personalData.photo ? t('forms.personal.photoHintWithPhoto') : t('forms.personal.photoHint')}
        </p>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('forms.personal.firstName')}
          </label>
          <input
            type="text"
            value={personalData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('forms.personal.firstNamePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('forms.personal.lastName')}
          </label>
          <input
            type="text"
            value={personalData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('forms.personal.lastNamePlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('forms.personal.email')}
        </label>
        <input
          type="email"
          value={personalData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('forms.personal.emailPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('forms.personal.phone')}
        </label>
        <input
          type="tel"
          value={personalData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('forms.personal.phonePlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('forms.personal.address')}
        </label>
        <input
          type="text"
          value={personalData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('forms.personal.addressPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('forms.personal.city')}
          </label>
          <input
            type="text"
            value={personalData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('forms.personal.cityPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('forms.personal.country')}
          </label>
          <input
            type="text"
            value={personalData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('forms.personal.countryPlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('forms.personal.linkedIn')}
        </label>
        <input
          type="url"
          value={personalData.linkedIn || ''}
          onChange={(e) => handleInputChange('linkedIn', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('forms.personal.linkedInPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('forms.personal.website')}
        </label>
        <input
          type="url"
          value={personalData.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('forms.personal.websitePlaceholder')}
        />
      </div>
    </div>
  );
}
