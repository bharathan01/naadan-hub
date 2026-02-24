
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../../services/admin.service';
import { UserProfile } from '../../../services/auth.service';
import toast from 'react-hot-toast';

export default function UserManagement() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error: any) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user: UserProfile) => {
        try {
            const newStatus = !(user as any).is_active;
            await adminService.updateUserStatus(user.id, newStatus);
            toast.success(`User ${newStatus ? 'enabled' : 'disabled'} successfully`);
            loadUsers();
        } catch (error: any) {
            toast.error('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage platform users and account access</p>
                    </div>
                    <div className="relative">
                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 uppercase text-xs font-black text-gray-400">
                        <tr>
                            <th className="px-6 py-4 text-left">User</th>
                            <th className="px-6 py-4 text-left">Role</th>
                            <th className="px-6 py-4 text-left">Joined</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                    Loading users...
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No users found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                {user.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{user.full_name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ${(user as any).is_active === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {(user as any).is_active === false ? 'Disabled' : 'Enabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${(user as any).is_active === false
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            {(user as any).is_active === false ? 'Enable' : 'Disable'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
