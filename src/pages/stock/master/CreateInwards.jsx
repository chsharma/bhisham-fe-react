import React, { useEffect, useState } from "react";
import {
  getAllSuppliers,
  getAllitem,
  getAllbatch,
  getAllManufacturers,
  createBatch,
} from "../../../services/api";
import { toast } from "react-toastify";
import { FiPlus, FiX } from "react-icons/fi";

const CreateInwards = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);

  const [formData, setFormData] = useState({
    supplier: "",
    invoiceNo: "",
    invoiceDate: "",
    remarks: "",
    item: "",
    batchNo: "",
    mfdDate: "",
    expiryDate: "",
    qty: "",
    availableQty: "",
    manufacturer: "",
  });

  const [newBatchData, setNewBatchData] = useState({
    batch_number: "",
    manufacturing_date: "",
    expiry_date: "",
    cost_price: "",
    selling_price: "",
    mrp: "",
    medicine_id: "",
    manufacturer_id: "",
  });

  const handleSupplierFocus = async () => {
    const res = await getAllSuppliers();
    if (Array.isArray(res?.data?.data)) {
      setSuppliers(res.data.data);
    }
  };

  const handleItemFocus = async () => {
    const res = await getAllitem();
    if (res?.data) setItems(res.data);
  };

  const handleBatchFocus = async () => {
    const res = await getAllbatch();
    if (Array.isArray(res?.data)) {
      const existing = res.data;
      const hasNA = existing.some((b) => b.batch_number === "N/A");
      const updated = hasNA
        ? existing
        : [...existing, { id: "na", batch_number: "N/A" }];
      setBatches(updated);
    }
  };

  useEffect(() => {
    getAllManufacturers().then((res) => {
      if (Array.isArray(res?.data)) setManufacturers(res.data);
    });
  }, []);

  useEffect(() => {
    if (!formData.batchNo) return;

    if (formData.batchNo === "N/A") {
      setFormData((prev) => ({
        ...prev,
        availableQty: "",
        manufacturer: "",
      }));
      setShowBatchModal(false);
      return;
    }

    const batch = batches.find((b) => b.batch_number === formData.batchNo);
    if (batch) {
      setFormData((prev) => ({
        ...prev,
        availableQty: batch?.availableQty ?? "",
        manufacturer: batch?.manufacturer_name ?? "",
      }));
      setShowBatchModal(false);
    } else {
      setShowBatchModal(true);
    }
  }, [formData.batchNo, batches]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewBatchChange = (e) => {
    const { name, value } = e.target;
    setNewBatchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = () => {
    if (!formData.item || !formData.batchNo || !formData.qty) {
      toast.error("Please fill Item, Batch No and Qty before adding");
      return;
    }
    setEntries([...entries, formData]);
    setFormData({
      ...formData,
      item: "",
      batchNo: "",
      mfdDate: "",
      expiryDate: "",
      qty: "",
      availableQty: "",
      manufacturer: "",
    });
  };

  const handleFormClose = () => {
    setShowBatchModal(false);
    setNewBatchData({
      batch_number: "",
      manufacturing_date: "",
      expiry_date: "",
      cost_price: "",
      selling_price: "",
      mrp: "",
      medicine_id: "",
      manufacturer_id: "",
    });
  };

  const handleBatchCreate = async () => {
    const {
      batch_number,
      manufacturing_date,
      expiry_date,
      cost_price,
      selling_price,
      mrp,
      medicine_id,
      manufacturer_id,
    } = newBatchData;

    if (
      !batch_number.trim() ||
      !manufacturing_date ||
      !expiry_date ||
      !cost_price ||
      !selling_price ||
      !mrp ||
      !medicine_id ||
      !manufacturer_id
    ) {
      toast.error("Please fill all batch details");
      return;
    }

    setBatchProcessing(true);

    try {
      const payload = {
        batch_number: batch_number.trim(),
        manufacturing_date: new Date(manufacturing_date).toISOString(),
        expiry_date: new Date(expiry_date).toISOString(),
        cost_price: Number(cost_price),
        selling_price: Number(selling_price),
        mrp: Number(mrp),
        medicine_id: Number(medicine_id),
        manufacturer_id: Number(manufacturer_id),
      };

      const response = await createBatch(payload);

      toast.success(response.message || "Batch created successfully");

      if (response?.data) {
        setBatches((prev) => [...prev, response.data]);
        setFormData((prev) => ({ ...prev, batchNo: response.data.batch_number }));
      }
      handleFormClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create batch");
      console.error(error);
    } finally {
      setBatchProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12">
        Inward Entry Form
      </h1>

      {/* Supplier/Invoice Info */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Supplier</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            onFocus={handleSupplierFocus}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Invoice No</label>
          <input
            name="invoiceNo"
            value={formData.invoiceNo}
            onChange={handleChange}
            placeholder="Invoice No"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Invoice Date</label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Notes/Remarks"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
      </section>

      {/* Item, Batch, Quantity and Manufacturer Details */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Item</label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            onFocus={handleItemFocus}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i.id} value={i.generic_name}>
                {i.generic_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Batch No</label>
          <div className="flex gap-4">
            <select
              name="batchNo"
              value={formData.batchNo}
              onChange={handleChange}
              onFocus={handleBatchFocus}
              className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.batch_number}>
                  {b.batch_number}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowBatchModal(true)}
              className="bg-black text-white px-5 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center gap-1"
              aria-label="Create new batch"
            >
              <FiPlus /> Create
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">MFD Date</label>
          <input
            type="date"
            name="mfdDate"
            value={formData.mfdDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
          <input
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Available Qty</label>
          <input
            name="availableQty"
            value={formData.availableQty}
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Manufacturer</label>
          <select
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleAddEntry}
            disabled={!formData.item || !formData.batchNo || !formData.qty}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition"
          >
            Add
          </button>
        </div>
      </section>

      {/* Added Entries */}
      <section>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Added Entries</h2>
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No entries added yet.</p>
        ) : (
          entries.map((entry, i) => (
            <div
              key={i}
              className="grid grid-cols-7 gap-4 bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 font-semibold"
            >
              <span>{entry.item}</span>
              <span>{entry.batchNo}</span>
              <span>MFD: {entry.mfdDate}</span>
              <span>EXP: {entry.expiryDate}</span>
              <span>{entry.qty}</span>
              <span>{entry.availableQty}</span>
              <span>{entry.manufacturer}</span>
            </div>
          ))
        )}
      </section>

      <button className="bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-lg px-12 py-4 transition">
        Submit
      </button>

      {/* Create New Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-2xl font-bold mb-6">Add Batch</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBatchCreate();
              }}
              className="space-y-5"
              noValidate
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="medicine_id" className="block text-sm font-medium text-gray-700 mb-1">Medicine ID</label>
                  <input
                    type="number"
                    id="medicine_id"
                    name="medicine_id"
                    value={newBatchData.medicine_id}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="manufacturer_id" className="block text-sm font-medium text-gray-700 mb-1">Manufacturer ID</label>
                  <input
                    type="number"
                    id="manufacturer_id"
                    name="manufacturer_id"
                    value={newBatchData.manufacturer_id}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="batch_number" className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    id="batch_number"
                    name="batch_number"
                    value={newBatchData.batch_number}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    required
                  />
                </div>
                {/* <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={newBatchData.quantity || ""}
                    onChange={(e) =>
                      setNewBatchData((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    className="input-field"
                    min={1}
                    required
                  />
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="manufacturing_date" className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Date</label>
                  <input
                    type="date"
                    id="manufacturing_date"
                    name="manufacturing_date"
                    value={newBatchData.manufacturing_date}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    id="expiry_date"
                    name="expiry_date"
                    value={newBatchData.expiry_date}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                  <input
                    type="number"
                    id="cost_price"
                    name="cost_price"
                    value={newBatchData.cost_price}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                  <input
                    type="number"
                    id="selling_price"
                    name="selling_price"
                    value={newBatchData.selling_price}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                  <input
                    type="number"
                    id="mrp"
                    name="mrp"
                    value={newBatchData.mrp}
                    onChange={handleNewBatchChange}
                    className="input-field"
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleFormClose}
                  className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-100 transition"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={batchProcessing}
                  className={`inline-flex items-center px-6 py-2 text-white text-sm font-medium rounded-md transition ${
                    batchProcessing
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                  }`}
                >
                  {batchProcessing ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CreateInwards;
