import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllitem,
  createItems,
  updatedItems,
  deleteItem,
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

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
};

const CreateItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingIds, setProcessingIds] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    generic_name: "",
    storage_area: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getAllitem();
      const fetched = response?.data || [];
      setItems(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      toast.error("Error fetching items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredItems = items.filter(
    (item) =>
      item.generic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storage_area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ generic_name: "", storage_area: "" });
    setCurrentItem(null);
  };

  const handleFormOpen = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        generic_name: item.generic_name || "",
        storage_area: item.storage_area || "",
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
    if (!formData.generic_name || !formData.storage_area) {
      toast.error("Generic Name and Storage Area are required");
      return;
    }

    const payload = {
      ...formData,
      sku_slug: slugify(formData.generic_name),
    };

    setProcessingIds((prev) => [...prev, "create"]);
    try {
      await createItems(payload);
      toast.success("Item created successfully");
      fetchItems();
      handleFormClose();
    } catch (error) {
      toast.error("Failed to create item");
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== "create"));
    }
  };

  const handleUpdate = async () => {
    if (!currentItem) {
      toast.error("No item selected for update");
      return;
    }
    if (!formData.generic_name || !formData.storage_area) {
      toast.error("Generic Name and Storage Area are required");
      return;
    }

    const itemId = currentItem._id ?? currentItem.id;
    if (!itemId) {
      toast.error("Item ID is missing for update");
      console.error("Update failed: item ID undefined", currentItem);
      return;
    }

    // Construct payload explicitly
    const payload = {
      generic_name: formData.generic_name,
      storage_area: formData.storage_area,
      sku_slug: slugify(formData.generic_name),
    };

    setProcessingIds((prev) => [...prev, itemId]);
    try {
      console.log("Calling updatedItems with id:", itemId, "payload:", payload);
      await updatedItems(itemId, payload);
      toast.success("Item updated successfully");
      fetchItems();
      handleFormClose();
    } catch (error) {
      toast.error("Failed to update item");
      console.error("Update error:", error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

    const confirmDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const actualId = itemToDelete?._id ?? itemToDelete?.id ?? itemToDelete;
    if (!actualId) {
      toast.error("Item ID is missing for delete");
      console.error("Delete failed: item ID undefined", itemToDelete);
      return;
    }

    setProcessingIds((prev) => [...prev, actualId]);
    try {
      await deleteItem(actualId);
      toast.success("Item deleted successfully");
      setItems((prev) => prev.filter((i) => (i._id ?? i.id) !== actualId));
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== actualId));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
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
            <FiPlus /> Add Item
          </button>
          <button
            onClick={fetchItems}
            className="btn btn-secondary p-2"
            title="Refresh"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentItem ? "Edit Item" : "Add Item"}
            </h2>
            <div className="space-y-4">
              {["generic_name", "storage_area"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
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
    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
  >
    <FiX className="mr-2" />
    Cancel
  </button>

  <button
    onClick={currentItem ? handleUpdate : handleCreate}
    disabled={processingIds.includes(currentItem?.id || 'create')}
    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition
      ${processingIds.includes(currentItem?.id || 'create')
        ? 'bg-blue-300 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500'}`}
  >
    {processingIds.includes(currentItem?.id || 'create') ? (
      <span className="flex items-center">
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Processing...
      </span>
    ) : (
      <span className="flex items-center">
        <FiSave className="mr-2" />
        {currentItem ? 'Update' : 'Save'}
      </span>
    )}
  </button>
</div>


            
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-t-transparent rounded-full border-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Generic Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Storage Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id ?? item.id}>
                    <td className="px-6 py-4">{item.generic_name}</td>
                    <td className="px-6 py-4">{item.storage_area}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFormOpen(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={processingIds.includes(item._id ?? item.id)}
                          className={`text-red-600 hover:text-red-900 ${
                            processingIds.includes(item._id ?? item.id)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500"
                  >
                    {searchTerm ? "No matching items" : "No items available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          

          {filteredItems.length > 0 ? (
            <>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded flex items-center ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <FiChevronLeft className="mr-1" /> Previous
                  </button>
                </div>

                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded flex items-center ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Next <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-10">No items found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateItem;

