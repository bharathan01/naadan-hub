
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ContentSection {
  id: string;
  section: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function SiteContent() {
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    {
      id: '1',
      section: 'hero',
      title: 'Homepage Hero Section',
      content: 'Fresh from Farm to Your Table - Experience the authentic taste of Kerala with our premium organic products sourced directly from local farmers.',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      section: 'about',
      title: 'About Us',
      content: 'Naadan Hub connects you directly with Kerala\'s finest organic farmers. We believe in sustainable agriculture, fair trade, and bringing you the freshest produce while supporting local farming communities.',
      updated_at: '2024-01-14'
    },
    {
      id: '3',
      section: 'footer_contact',
      title: 'Footer Contact Information',
      content: 'Address: Kottayam, Kerala, India | Phone: +91 98765 43210 | Email: info@naadanhub.com',
      updated_at: '2024-01-13'
    },
    {
      id: '4',
      section: 'footer_social',
      title: 'Social Media Links',
      content: 'Facebook: https://facebook.com/naadanhub | Instagram: https://instagram.com/naadanhub | Twitter: https://twitter.com/naadanhub',
      updated_at: '2024-01-13'
    },
    {
      id: '5',
      section: 'mission',
      title: 'Our Mission',
      content: 'To create a sustainable marketplace that empowers farmers, promotes organic agriculture, and delivers authentic Kerala products to customers worldwide.',
      updated_at: '2024-01-12'
    }
  ]);

  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      content: section.content
    });
    setShowEditModal(true);
  };

  const handleUpdateContent = () => {
    if (editingSection) {
      setContentSections(contentSections.map(section => 
        section.id === editingSection.id 
          ? { 
              ...section, 
              title: formData.title,
              content: formData.content,
              updated_at: new Date().toISOString().split('T')[0]
            }
          : section
      ));
      setEditingSection(null);
      setFormData({ title: '', content: '' });
      setShowEditModal(false);
    }
  };

  const getSectionIcon = (sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return 'ri-home-line';
      case 'about':
        return 'ri-information-line';
      case 'footer_contact':
        return 'ri-phone-line';
      case 'footer_social':
        return 'ri-share-line';
      case 'mission':
        return 'ri-target-line';
      default:
        return 'ri-file-text-line';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Site Content Management</h2>
            <p className="text-gray-600 mt-1">Edit website content and information</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            <i className="ri-edit-line mr-1"></i>
            CMS Panel
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6">
        <div className="grid gap-6">
          {contentSections.map((section) => (
            <div key={section.id} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10`}>
                  <i className={`${getSectionIcon(section.section)} text-2xl text-primary`}></i>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                      <span className="text-sm text-gray-500 capitalize">
                        {section.section.replace('_', ' ')} section
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                      Updated: {new Date(section.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>

                  <button
                    onClick={() => handleEditSection(section)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
                  >
                    <i className="ri-edit-line"></i>
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Settings */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-settings-line text-xl text-green-600"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">General Settings</h3>
                <p className="text-sm text-gray-600">Site-wide configuration</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Maintenance Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">User Registration</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Seller Registration</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-notification-line text-xl text-yellow-600"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Manage alerts and messages</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">SMS Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Content Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Edit Content</h3>
              <p className="text-gray-600 mt-1">Update the content for this section</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={8}
                  placeholder="Enter content..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-blue-900">Content Guidelines</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Keep content clear, concise, and aligned with your brand voice. 
                      For contact information, use the format: Address | Phone | Email for easy parsing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSection(null);
                  setFormData({ title: '', content: '' });
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContent}
                disabled={!formData.title || !formData.content}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Content
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
