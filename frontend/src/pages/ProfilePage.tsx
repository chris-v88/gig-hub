import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useUserProfile, useUpdateProfile, useUploadAvatar } from '../hooks/useUser';
import { useUserGigs } from '../hooks/useGig';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

// Helper function to convert boolean gender to string
const convertGenderToString = (
  gender: boolean | null | undefined
): 'male' | 'female' | 'other' | '' => {
  if (gender === true) return 'male';
  if (gender === false) return 'female';
  return 'other';
};

// Helper function to convert string gender to boolean for API
const convertGenderToBoolean = (gender: string): boolean | null => {
  if (gender === 'male') return true;
  if (gender === 'female') return false;
  return null; // for 'other' or empty
};

interface EditFormData {
  name: string;
  username: string;
  phone: string;
  description: string;
  country: string;
  gender: 'male' | 'female' | 'other' | '';
  birthday: string;
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    username: '',
    phone: '',
    description: '',
    country: '',
    gender: '',
    birthday: '',
  });

  // Parse userId from URL params
  const profileUserId = userId ? parseInt(userId, 10) : currentUser?.id || 0;
  const isOwnProfile = currentUser?.id === profileUserId;

  // Fetch profile data
  const { data: profileUser, isLoading, error } = useUserProfile(profileUserId);

  // Fetch user's gigs
  const { data: userGigs, isLoading: gigsLoading } = useUserGigs(profileUserId);

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profileUser && isOwnProfile) {
      setEditFormData({
        name: profileUser.name || '',
        username: profileUser.username || '',
        phone: profileUser.phone || '',
        description: profileUser.description || '',
        country: profileUser.country || '',
        gender: convertGenderToString(profileUser.gender),
        birthday: profileUser.birthday || '',
      });
    }
  }, [profileUser, isOwnProfile]);

  // Redirect to login if not authenticated and trying to view own profile
  if (!userId && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUser) return;

    try {
      await updateProfileMutation.mutateAsync({
        userId: profileUser.id,
        data: {
          ...editFormData,
          gender: convertGenderToBoolean(editFormData.gender),
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await uploadAvatarMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h2>
          <p className="text-gray-600">
            The user profile you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {profileUser.profile_image ? (
                  <img
                    src={profileUser.profile_image}
                    alt={profileUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-4xl font-bold">
                    {profileUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Avatar Upload Button - Only for own profile */}
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 cursor-pointer hover:bg-green-700 shadow-lg">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadAvatarMutation.isPending}
                  />
                </label>
              )}

              {/* Online Status */}
              {profileUser.is_online && (
                <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileUser.name}</h1>
                  <p className="text-lg text-gray-600 mb-1">
                    @{profileUser.username || 'No username'}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      📅 Joined {new Date(profileUser.created_at).toLocaleDateString()}
                    </span>
                    {profileUser.country && (
                      <span className="flex items-center gap-1">📍 {profileUser.country}</span>
                    )}
                  </div>
                </div>

                {/* Edit Profile Button - Only for own profile */}
                {isOwnProfile && (
                  <Button onClick={() => setIsEditing(true)} className="mt-4 md:mt-0">
                    ✏️ Edit Profile
                  </Button>
                )}
              </div>

              {/* Bio */}
              {profileUser.description && (
                <p className="text-gray-700 leading-relaxed mb-4">{profileUser.description}</p>
              )}

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-900">
                    {profileUser.total_orders_completed || 0}
                  </div>
                  <div className="text-gray-500">Orders Completed</div>
                </div>
                {profileUser.is_online && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-500">Online</div>
                    <div className="text-gray-500">Status</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              👤 Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{profileUser.email}</p>
              </div>
              {profileUser.phone && (
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{profileUser.phone}</p>
                </div>
              )}
              {profileUser.gender !== undefined && (
                <div>
                  <label className="text-sm text-gray-500">Gender</label>
                  <p className="font-medium capitalize">
                    {convertGenderToString(profileUser.gender)}
                  </p>
                </div>
              )}
              {profileUser.birthday && (
                <div>
                  <label className="text-sm text-gray-500">Birthday</label>
                  <p className="font-medium">
                    {new Date(profileUser.birthday).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Activity Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 Activity Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold">{profileUser.total_orders_completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold">
                  {new Date(profileUser.created_at).getFullYear()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Status</span>
                <span
                  className={`font-semibold ${profileUser.is_online ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {profileUser.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions for Other Users */}
        {!isOwnProfile && (
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                💬 Send Message
              </Button>
              <Button variant="outline" size="sm">
                ⭐ View Gigs
              </Button>
              <Button variant="outline" size="sm">
                🚩 Report User
              </Button>
            </div>
          </Card>
        )}

        {/* User's Gigs Section */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🎯 {isOwnProfile ? 'My Gigs' : `${profileUser.name}'s Gigs`}
          </h3>

          {gigsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : userGigs && userGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGigs.map((gig) => (
                <Link
                  key={gig.id}
                  to={`/gig/${gig.id}`}
                  className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {gig.image_url ? (
                      <img
                        src={gig.image_url}
                        alt={gig.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-4xl">📋</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{gig.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {gig.short_description || gig.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm font-medium ml-1">{gig.average_rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({gig.total_reviews})</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Starting at</div>
                        <div className="font-bold text-green-600">${gig.price}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span>🚚 {gig.delivery_time} days</span>
                      <span>•</span>
                      <span>📦 {gig.orders_completed || 0} orders</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {isOwnProfile ? (
                <div>
                  <p className="text-lg mb-2">You haven&apos;t created any gigs yet</p>
                  <p className="text-sm">Create your first gig to start earning!</p>
                  <Button className="mt-4">Create Gig</Button>
                </div>
              ) : (
                <p>This user hasn&apos;t created any gigs yet.</p>
              )}
            </div>
          )}
        </Card>

        {/* Upload Avatar Progress */}
        {uploadAvatarMutation.isPending && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center gap-3">
              <Spinner />
              <span className="text-sm text-gray-600">Uploading avatar...</span>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <Input
                      type="text"
                      value={editFormData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <Input
                      type="text"
                      value={editFormData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                    <Input
                      type="date"
                      value={editFormData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
