import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { enquiryService, Enquiry } from '../../../services/enquiry.service';
import toast from 'react-hot-toast';

export default function EnquiryManagement() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            const data = await enquiryService.getEnquiries();
            setEnquiries(data);
        } catch (error) {
            console.error('Error loading enquiries:', error);
            toast.error('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: 'open' | 'closed') => {
        const newStatus = currentStatus === 'open' ? 'closed' : 'open';
        try {
            await enquiryService.updateEnquiryStatus(id, newStatus);
            setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
            toast.success(`Enquiry marked as ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteEnquiry = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            await enquiryService.deleteEnquiry(id);
            setEnquiries(enquiries.filter(e => e.id !== id));
            toast.success('Enquiry deleted');
        } catch (error) {
            toast.error('Failed to delete enquiry');
        }
    };

    const filteredEnquiries = enquiries.filter(e =>
        filter === 'all' ? true : e.status === filter
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Contact Enquiries</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['all', 'open', 'closed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all cursor-pointer ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Contact</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Subject</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredEnquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No enquiries found.
                                    </td>
                                </tr>
                            ) : (
                                filteredEnquiries.map((enquiry) => (
                                    <EnquiryRow
                                        key={enquiry.id}
                                        enquiry={enquiry}
                                        onToggleStatus={toggleStatus}
                                        onDelete={deleteEnquiry}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function EnquiryRow({ enquiry, onToggleStatus, onDelete }: {
    enquiry: Enquiry,
    onToggleStatus: (id: string, s: 'open' | 'closed') => void,
    onDelete: (id: string) => void
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <tr className={`hover:bg-gray-50 transition-colors ${enquiry.status === 'closed' ? 'opacity-75' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(enquiry.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                    <div className="text-xs text-gray-500">{enquiry.email}</div>
                    {enquiry.phone && <div className="text-xs text-gray-500">{enquiry.phone}</div>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    {enquiry.subject}
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${enquiry.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {enquiry.status}
                    </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-primary hover:text-primary/80 p-2 cursor-pointer"
                        title="View Message"
                    >
                        <i className={`ri-eye-${isExpanded ? 'off-' : ''}line text-xl`}></i>
                    </button>
                    <button
                        onClick={() => onToggleStatus(enquiry.id, enquiry.status)}
                        className={`${enquiry.status === 'open' ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'} p-2 cursor-pointer`}
                        title={enquiry.status === 'open' ? 'Mark as Closed' : 'Mark as Open'}
                    >
                        <i className={`ri-${enquiry.status === 'open' ? 'checkbox-circle' : 'refresh'}-line text-xl`}></i>
                    </button>
                    <button
                        onClick={() => onDelete(enquiry.id)}
                        className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                        title="Delete"
                    >
                        <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2 p-4 bg-white rounded-lg border shadow-inner"
                        >
                            <h4 className="font-bold text-gray-900 border-b pb-2">Enquiry Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Contact Method:</span>
                                    <p className="text-gray-900">{enquiry.email} {enquiry.phone ? `/ ${enquiry.phone}` : ''}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Subject:</span>
                                    <p className="text-gray-900">{enquiry.subject}</p>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500 text-sm">Message:</span>
                                <p className="text-gray-900 mt-1 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded border">
                                    {enquiry.message}
                                </p>
                            </div>
                        </motion.div>
                    </td>
                </tr>
            )}
        </>
    );
}
