import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllbatch,
  createBatch,
  updateBatch,
  deleteBatches,
} from "../../../services/api"; // Adjust the import path as necessary
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

const BatchPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingIds, setProcessingIds] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [formData, setFormData] = useState({
    medicine_id: "",
    manufacturer_id: "",
    batch_number: "",
    // quantity: "",
    manufacturing_date: "",
    expiry_date: "",
    cost_price: "",
    selling_price: "",
    mrp: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await getAllbatch();
      const fetchedBatches = response?.data || [];
      setBatches(Array.isArray(fetchedBatches) ? fetchedBatches : []);
    } catch (error) {
      toast.error("Error fetching batches");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredBatches = batches.filter(
    (batch) =>
      batch.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.expiry_date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBatches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);

  const validateForm = () => {
    const {
      medicine_id,
      manufacturer_id,
      batch_number,
      // quantity,
      manufacturing_date,
      expiry_date,
      cost_price,
      selling_price,
      mrp,
    } = formData;

    if (
      !medicine_id ||
      !manufacturer_id ||
      !batch_number.trim() ||
      // !quantity ||
      !manufacturing_date ||
      !expiry_date ||
      !cost_price ||
      !selling_price ||
      !mrp
    ) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      medicine_id: "",
      manufacturer_id: "",
      batch_number: "",
      // quantity: "",
      manufacturing_date: "",
      expiry_date: "",
      cost_price: "",
      selling_price: "",
      mrp: "",
    });
    setCurrentBatch(null);
  };

  const handleFormOpen = (batch = null) => {
    if (batch) {
      setCurrentBatch(batch);
      setFormData({
        medicine_id: batch.medicine_id?.toString() || "",
        manufacturer_id: batch.manufacturer_id?.toString() || "",
        batch_number: batch.batch_number || "",
        // quantity: batch.quantity?.toString() || "",
        manufacturing_date: batch.manufacturing_date
          ? batch.manufacturing_date.slice(0, 10)
          : "",
        expiry_date: batch.expiry_date ? batch.expiry_date.slice(0, 10) : "",
        cost_price: batch.cost_price?.toString() || "",
        selling_price: batch.selling_price?.toString() || "",
        mrp: batch.mrp?.toString() || "",
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
    if (!validateForm()) return;

    setProcessingIds((prev) => [...prev, "create"]);
    try {
      // Convert string numbers to proper types and ISO strings for dates
      const payload = {
        medicine_id: Number(formData.medicine_id),
        manufacturer_id: Number(formData.manufacturer_id),
        batch_number: formData.batch_number.trim(),
        // quantity: Number(formData.quantity),
        manufacturing_date: new Date(formData.manufacturing_date).toISOString(),
        expiry_date: new Date(formData.expiry_date).toISOString(),
        cost_price: Number(formData.cost_price),
        selling_price: Number(formData.selling_price),
        mrp: Number(formData.mrp),
      };
      const response = await createBatch(payload);
      toast.success(response.message || "Batch created successfully");
      fetchBatches();
      handleFormClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create batch"
      );
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== "create"));
    }
  };

  const handleUpdate = async () => {
    if (!currentBatch) return;
    if (!validateForm()) return;

    setProcessingIds((prev) => [...prev, currentBatch.id]);
    try {
      const payload = {
        medicine_id: Number(formData.medicine_id),
        manufacturer_id: Number(formData.manufacturer_id),
        batch_number: formData.batch_number.trim(),
        // quantity: Number(formData.quantity),
        // manufacturing_date: new Date(formData.manufacturing_date).toISOString(),
        expiry_date: new Date(formData.expiry_date).toISOString(),
        cost_price: Number(formData.cost_price),
        selling_price: Number(formData.selling_price),
        mrp: Number(formData.mrp),
      };
      const response = await updateBatch(currentBatch.id, payload);
      toast.success(response.message || "Batch updated successfully");
      fetchBatches();
      handleFormClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update batch"
      );
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== currentBatch.id));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    setProcessingIds((prev) => [...prev, id]);
    try {
      await deleteBatches(id);
      toast.success("Batch deleted successfully");
      fetchBatches();
    } catch (error) {
      toast.error("Failed to delete batch");
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white text-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold leading-tight mb-3">
            Batch Management
          </h1>
          <p className="text-base text-gray-500">
            Manage your batches with ease and precision.
          </p>
        </header>

        {/* Actions */}
        <section className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
         <div className="flex items-center gap-3">
  <button
    onClick={() => handleFormOpen()}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-blue-700 transition"
  >
    <FiPlus size={18} /> Add Batch
  </button>

  <button
    onClick={fetchBatches}
    className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition"
    title="Refresh"
  >
    <FiRefreshCw size={20} />
  </button>
</div>

        </section>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8">
              <h2 className="text-2xl font-bold mb-6">
                {currentBatch ? "Edit Batch" : "Add Batch"}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  currentBatch ? handleUpdate() : handleCreate();
                }}
                className="space-y-5"
                noValidate
              >
                {/* For medicine_id and manufacturer_id using number input or text with placeholder: */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="medicine_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Medicine ID
                    </label>
                    <input
                      type="number"
                      id="medicine_id"
                      name="medicine_id"
                      value={formData.medicine_id}
                      onChange={handleInputChange}
                      className="input-field"
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="manufacturer_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Manufacturer ID
                    </label>
                    <input
                      type="number"
                      id="manufacturer_id"
                      name="manufacturer_id"
                      value={formData.manufacturer_id}
                      onChange={handleInputChange}
                      className="input-field"
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="batch_number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Batch Number
                    </label>
                    <input
                      type="text"
                      id="batch_number"
                      name="batch_number"
                      value={formData.batch_number}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  {/* <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="input-field"
                      min={1}
                      required
                    />
                  </div> */}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="manufacturing_date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Manufacturing Date
                    </label>
                    <input
                      type="date"
                      id="manufacturing_date"
                      name="manufacturing_date"
                      value={formData.manufacturing_date}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="expiry_date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      id="expiry_date"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="cost_price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Cost Price
                    </label>
                    <input
                      type="number"
                      id="cost_price"
                      name="cost_price"
                      value={formData.cost_price}
                      onChange={handleInputChange}
                      className="input-field"
                      min={0}
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="selling_price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Selling Price
                    </label>
                    <input
                      type="number"
                      id="selling_price"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleInputChange}
                      className="input-field"
                      min={0}
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mrp"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      MRP
                    </label>
                    <input
                      type="number"
                      id="mrp"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      className="input-field"
                      min={0}
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleFormClose}
                    className="inline-flex items-center px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingIds.includes(
                      currentBatch?.id || "create"
                    )}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-blue-700 transition ${
                      processingIds.includes(
                        currentBatch?.id || "create"
                      )
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-black hover:bg-gray-900"
                    }`}
                  >
                    <FiSave className="mr-2" />
                    {currentBatch ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-t-transparent rounded-full border-black" />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Batch Number",
                    "",
                    "Manufacturing Date",
                    "Expiry Date",
                    "Cost Price",
                    "Selling Price",
                    "MRP",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((batch) => (
                    <tr key={batch.id}>
                      <td className="px-6 py-4">{batch.batch_number}</td>
                      <td className="px-6 py-4">{batch.quantity}</td>
                      <td className="px-6 py-4">
                        {batch.manufacturing_date
                          ? batch.manufacturing_date.slice(0, 10)
                          : ""}
                      </td>
                      <td className="px-6 py-4">
                        {batch.expiry_date ? batch.expiry_date.slice(0, 10) : ""}
                      </td>
                      <td className="px-6 py-4">{batch.cost_price}</td>
                      <td className="px-6 py-4">{batch.selling_price}</td>
                      <td className="px-6 py-4">{batch.mrp}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFormOpen(batch)}
                            className="text-indigo-600 hover:text-indigo-900"
                            aria-label={`Edit batch ${batch.batch_number}`}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(batch.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={`Delete batch ${batch.batch_number}`}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-8 text-gray-400 font-semibold"
                    >
                      {searchTerm ? "No matching batches" : "No batches available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

           {filteredBatches.length > 0 ? (
  <div className="mt-6 flex justify-between items-center">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-md font-medium transition ${
        currentPage === 1
          ? "bg-blue-100 text-blue-300 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
      aria-label="Previous Page"
    >
      <FiChevronLeft className="inline-block mr-1" />
      Previous
    </button>

    <div className="flex space-x-2">
      {Array.from({ length: totalPages }, (_, idx) => (
        <button
          key={idx + 1}
          onClick={() => handlePageChange(idx + 1)}
          className={`px-4 py-2 rounded-md font-medium transition ${
            currentPage === idx + 1
              ? "bg-blue-700 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
          aria-current={currentPage === idx + 1 ? "page" : undefined}
        >
          {idx + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-md font-medium transition ${
        currentPage === totalPages
          ? "bg-blue-100 text-blue-300 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
      aria-label="Next Page"
    >
      Next
      <FiChevronRight className="inline-block ml-1" />
    </button>
  </div>
) : (
  <p className="text-center text-gray-500 py-10 font-semibold">
    No batches found.
  </p>
)}
          </div>
        )}
      </div>
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          color: #374151;
          transition: border-color 0.15s ease-in-out;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgb(59 130 246 / 0.3);
        }
      `}</style>
    </div>
  );
};

export default BatchPage;

