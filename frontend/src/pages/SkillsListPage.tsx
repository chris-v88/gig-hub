import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import skillApi from '../api/skill';
import { Skill, PaginationResponse } from '../types/api.types';

const SkillsListPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const response: PaginationResponse<Skill> = await skillApi.searchPagination(
        currentPage,
        pageSize,
        searchKeyword
      );
      setSkills(response.data);
      setTotal(response.totalRow);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleCreateSkill = () => {
    setShowCreateForm(true);
    setEditingSkill(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };

  const handleEditSkill = (skill: Skill) => {
    setShowCreateForm(true);
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description || '',
    });
    setFormErrors({});
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      await skillApi.delete(id);
      await fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill. It may be in use by users.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      if (editingSkill) {
        await skillApi.update(editingSkill.id, formData);
      } else {
        await skillApi.create(formData);
      }
      setShowCreateForm(false);
      await fetchSkills();
    } catch (error: unknown) {
      console.error('Error saving skill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error saving skill';
      setFormErrors({ general: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingSkill(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Management</h1>
          <p className="text-gray-600">Manage available skills for users on the platform</p>
        </div>

        {/* Search and Create Section */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search skills..."
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleCreateSkill} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Skill
            </Button>
          </div>
        </Card>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingSkill ? 'Edit Skill' : 'Create New Skill'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter skill name"
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter skill description"
                  />
                </div>
              </div>

              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {formErrors.general}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {editingSkill ? 'Updating...' : 'Creating...'}
                    </>
                  ) : editingSkill ? (
                    'Update Skill'
                  ) : (
                    'Create Skill'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Skills Table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Skills ({total})</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {skills.map((skill) => (
                      <tr key={skill.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {skill.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {skill.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {skill._count?.UserSkills || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(skill.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditSkill(skill)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              tone="danger"
                              onClick={() => handleDeleteSkill(skill.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {skills.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No skills found</p>
                </div>
              )}

              {/* Pagination */}
              {total > pageSize && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Pagination
                    page={currentPage}
                    totalPages={Math.ceil(total / pageSize)}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SkillsListPage;
