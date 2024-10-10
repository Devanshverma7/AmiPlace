import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const CertificationSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "" });

  const addCertification = () => {
    if (newCert.name && newCert.issuer && newCert.date) {
      setCertifications([...certifications, newCert]);
      setNewCert({ name: "", issuer: "", date: "" });
    }
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Certifications</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          onClick={addCertification}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
          >
            <div>
              <h3 className="font-medium">{cert.name}</h3>
              <p className="text-sm text-gray-600">
                {cert.issuer} - {cert.date}
              </p>
            </div>
            <button
              onClick={() => removeCertification(index)}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Certification Name"
          className="border p-2 rounded"
          value={newCert.name}
          onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Issuer"
          className="border p-2 rounded"
          value={newCert.issuer}
          onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={newCert.date}
          onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
        />
      </div>
    </div>
  );
};

export default CertificationSection;
