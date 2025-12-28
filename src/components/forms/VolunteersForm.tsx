import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import useTranslation from '../../i18n/useTranslation';
import { Plus, X, Heart, Calendar } from 'lucide-react';

export function VolunteersForm() {
  const { state, updateVolunteers } = useCV();
  const { volunteers } = state.cvData;
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({
    organization: '',
    role: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false
  });

  const addVolunteer = () => {
    if (newVolunteer.organization.trim() && newVolunteer.role.trim()) {
      const volunteerToAdd = { 
        id: Date.now().toString(), 
        ...newVolunteer
      };
      updateVolunteers([...volunteers, volunteerToAdd]);
      setNewVolunteer({
        organization: '',
        role: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false
      });
      setIsAdding(false);
    }
  };

  const removeVolunteer = (id: string) => {
    const updatedVolunteers = volunteers.filter(volunteer => volunteer.id !== id);
    updateVolunteers(updatedVolunteers);
  };

  return (
    <div className="space-y-4">
      {/* Add volunteer button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>{t('forms.volunteers.add')}</span>
        </button>
      )}

      {/* Add volunteer form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="volunteer-org" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.volunteers.organizationPlaceholder')}
              </label>
              <input
                id="volunteer-org"
                type="text"
                value={newVolunteer.organization}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, organization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('forms.volunteers.organizationPlaceholder') as string}
              />
            </div>
            <div>
              <label htmlFor="volunteer-role" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.volunteers.rolePlaceholder')}
              </label>
              <input
                id="volunteer-role"
                type="text"
                value={newVolunteer.role}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('forms.volunteers.rolePlaceholder') as string}
              />
            </div>
            <div>
              <label htmlFor="volunteer-start" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.volunteers.startDatePlaceholder')}
              </label>
              <input
                id="volunteer-start"
                type="date"
                value={newVolunteer.startDate}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="volunteer-end" className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.volunteers.endDatePlaceholder')}
              </label>
              <input
                id="volunteer-end"
                type="date"
                value={newVolunteer.endDate}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newVolunteer.current}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, current: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">{t('forms.volunteers.currentLabel')}</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="volunteer-description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de Actividades
            </label>
            <textarea
              id="volunteer-description"
              value={newVolunteer.description}
              onChange={(e) => setNewVolunteer({ ...newVolunteer, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe las actividades realizadas y el impacto generado..."
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={addVolunteer}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('forms.volunteers.save')}
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              {t('forms.volunteers.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Volunteers list */}
      <div className="space-y-3">
        {volunteers.map((volunteer) => (
          <div key={volunteer.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">{volunteer.role}</h3>
                  <p className="text-sm text-gray-600">{volunteer.organization}</p>
                  {(volunteer.startDate || volunteer.endDate) && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {volunteer.startDate && new Date(volunteer.startDate).toLocaleDateString()}
                        {volunteer.startDate && volunteer.endDate && ' - '}
                        {volunteer.endDate && new Date(volunteer.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {volunteer.description && (
                    <p className="text-sm text-gray-600 mt-2">{volunteer.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeVolunteer(volunteer.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {volunteers.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>{t('forms.volunteers.emptyTitle')}</p>
          <p className="text-sm">{t('forms.volunteers.emptyHint')}</p>
        </div>
      )}
    </div>
  );
}
