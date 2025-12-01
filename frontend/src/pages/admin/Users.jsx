/**
 * Admin Users - View and manage all users
 */
import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Mail, Home, Calendar, Shield } from 'lucide-react';
import { Container } from '../../components/layout';
import { Card, Button, Input, Badge, Avatar, Loading, EmptyState } from '../../components/common';
import { toast } from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/api/admin/users/';
      if (roleFilter && roleFilter !== 'all') {
        url += `?role=${roleFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { variant: 'primary', label: 'Admin', icon: <Shield className="w-3 h-3" /> },
      landlord: { variant: 'success', label: 'Landlord', icon: <Home className="w-3 h-3" /> },
      tenant: { variant: 'info', label: 'Tenant', icon: <UsersIcon className="w-3 h-3" /> },
    };
    
    const config = roleMap[role] || { variant: 'secondary', label: role };
    return (
      <Badge variant={config.variant}>
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">View and manage all platform users</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                leftIcon={<Search className="w-5 h-5" />}
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              <Button
                variant={roleFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('all')}
              >
                All Users
              </Button>
              <Button
                variant={roleFilter === 'landlord' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('landlord')}
              >
                Landlords
              </Button>
              <Button
                variant={roleFilter === 'tenant' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('tenant')}
              >
                Tenants
              </Button>
              <Button
                variant={roleFilter === 'admin' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter('admin')}
              >
                Admins
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Body>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.role === 'landlord').length}
              </p>
              <p className="text-sm text-gray-600">Landlords</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {users.filter(u => u.role === 'tenant').length}
              </p>
              <p className="text-sm text-gray-600">Tenants</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="w-16 h-16" />}
          title="No users found"
          message="No users match your search criteria"
        />
      ) : (
        <Card>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={user.profile_photo}
                            name={user.full_name || user.email}
                            size="sm"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {user.full_name || 'No name'}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {user.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.role === 'landlord' && (
                            <div className="flex items-center gap-1">
                              <Home className="w-4 h-4 text-gray-400" />
                              <span>{user.property_count || 0} properties</span>
                            </div>
                          )}
                          {user.role === 'tenant' && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{user.booking_count || 0} bookings</span>
                            </div>
                          )}
                          {user.role === 'admin' && (
                            <span className="text-gray-500">Admin</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.is_active ? 'success' : 'danger'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {user.is_verified && (
                            <Badge variant="info" size="sm">Verified</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Users;
