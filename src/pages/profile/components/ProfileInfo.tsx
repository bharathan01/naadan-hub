import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface ProfileInfoProps {
  user: User;
}

interface ProfileData {
  full_name: string;
  phone: string;
  email: string;
  role: string;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    phone: '',
    email: user.email || '',
    role: 'user',
  });

  useEffect(() => {
    loadProfile();
  }, [user.id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          email: data.email || user.email || '',
          role: data.role || 'user',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <p className="text-sm text-gray-500 mt-1">Update your personal details and contact information.</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-primary/20"
          >
            <i className="ri-edit-line text-lg"></i>
            <span className="font-semibold">Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setIsEditing(false);
                loadProfile();
              }}
              className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap shadow-lg shadow-primary/20 font-semibold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="ri-save-line text-lg"></i>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-user-line text-gray-400"></i>
              </div>
              <input
                type="text"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-mail-line text-gray-400"></i>
              </div>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400 italic">Registered email cannot be changed.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-phone-line text-gray-400"></i>
              </div>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-shield-user-line text-gray-400"></i>
              </div>
              <input
                type="text"
                value={profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                disabled
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-400 capitalize"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
