import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../../services/api";
import {
  FiSearch,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiSave,
  FiX,
} from "react-icons/fi";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingIds, setProcessingIds] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_number: "",
    email: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await getAllSuppliers();
      const fetchedSuppliers = response?.data?.data || [];
      setSuppliers(Array.isArray(fetchedSuppliers) ? fetchedSuppliers : []);
    } catch (error) {
      toast.error("Error fetching suppliers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", address: "", contact_number: "", email: "" });
    setCurrentSupplier(null);
  };

  const handleFormOpen = (supplier = null) => {
    if (supplier) {
      setCurrentSupplier(supplier);
      setFormData({
        name: supplier.name,
        address: supplier.address,
        contact_number: supplier.contact_number,
        email: supplier.email,
      });
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.address) {
      toast.error("Name and Address are required");
      return;
    }

    setProcessingIds((prev) => [...prev, "create"]);
    try {
      await createSupplier(formData);
      toast.success("Supplier created successfully");
      fetchSuppliers();
      handleFormClose();
    } catch (error) {
      toast.error("Failed to create supplier");
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== "create"));
    }
  };

  const handleUpdate = async () => {
    if (!currentSupplier) return;
    if (!formData.name || !formData.address) {
      toast.error("Name and Address are required");
      return;
    }

    setProcessingIds((prev) => [...prev, currentSupplier.id]);
    try {
      await updateSupplier(currentSupplier.id, formData);
      toast.success("Supplier updated successfully");
      fetchSuppliers();
      handleFormClose();
    } catch (error) {
      toast.error("Failed to update supplier");
      console.error(error);
    } finally {
      setProcessingIds((prev) =>
        prev.filter((id) => id !== currentSupplier.id)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;
    setProcessingIds((prev) => [...prev, id]);
    try {
      await deleteSupplier(id);
      toast.success("Supplier deleted successfully");
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to delete supplier");
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Top actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => handleFormOpen()}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Supplier
          </button>
          <button
            onClick={fetchSuppliers}
            className="btn btn-secondary p-2"
            title="Refresh"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentSupplier ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <div className="space-y-4">
              {["name", "address", "contact_number", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleFormClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition"
              >
                <FiX className="mr-2" />
                Cancel
              </button>

              <button
                onClick={currentSupplier ? handleUpdate : handleCreate}
                disabled={processingIds.includes(
                  currentSupplier?.id || "create"
                )}
                className={`inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md transition
    ${
      processingIds.includes(currentSupplier?.id || "create")
        ? "bg-blue-300 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
    }`}
              >
                <FiSave className="mr-2" />
                {currentSupplier ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-t-transparent rounded-full border-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Address", "Contact", "Email", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((supplier) => (
                  <tr key={supplier.id}>
                    <td className="px-6 py-4">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.address}</td>
                    <td className="px-6 py-4">
                      {supplier.contact_number || "-"}
                    </td>
                    <td className="px-6 py-4">{supplier.email || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFormOpen(supplier)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    {searchTerm
                      ? "No matching suppliers"
                      : "No suppliers available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredSuppliers.length > 0 ? (
            <>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    <FiChevronLeft className="mr-1" /> Previous
                  </button>
                </div>

                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Next <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-10">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierPage;
