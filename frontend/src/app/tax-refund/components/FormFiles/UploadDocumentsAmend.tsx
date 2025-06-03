// src/app/tax-refund/components/FormFiles/UploadDocumentsAmend.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CloudUpload } from 'lucide-react';

type FilesRecord = {
    passport: File | null;
    ssnDoc: File | null;
    ds2019: File | null;
    w2: File[];
    incorrect1040: File | null; // Documento 1040 equivocado
};

interface UploadDocumentsAmendProps {
    form: Record<string, any>;
    files: FilesRecord;
    setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setFiles: React.Dispatch<React.SetStateAction<FilesRecord>>;
    onNext: () => void;
}

export default function UploadDocumentsAmend({
    form,
    files,
    setValues,
    setFiles,
    onNext
}: UploadDocumentsAmendProps) {
    const [valid, setValid] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Validar que al menos suban los documentos básicos y el 1040 incorrecto
        const ok =
            files.passport !== null &&
            files.ssnDoc !== null &&
            files.incorrect1040 !== null &&
            Boolean(
                form.passportCountry?.trim() &&
                form.passportNumber?.trim() &&
                form.passportIssueDate &&
                form.passportExpiryDate &&
                form.ssnNumber?.trim()
            );
        setValid(ok);
    }, [files, form]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: fileList } = e.target;
        if (!fileList || fileList.length === 0) return;
        const file = fileList[0];
        setFiles(prev => ({ ...prev, [name]: file }));
    };

    const removeFile = (field: keyof FilesRecord) => {
        setFiles(prev => ({ ...prev, [field]: field === 'w2' ? [] : null }));
    };

    // Componente Drop reutilizable
    const Drop: React.FC<{
        label: string;
        name: keyof FilesRecord;
        required?: boolean;
    }> = ({ label, name, required = true }) => (
        <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 relative">
            <h3 className="text-lg font-semibold mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </h3>
            <label className="absolute inset-0 cursor-pointer">
                <input
                    type="file"
                    name={name}
                    onChange={handleFile}
                    className="opacity-0 w-full h-full"
                />
            </label>
            <CloudUpload className="mx-auto text-gray-500" size={36} />
            <p className="mt-2 text-sm text-gray-600">Click to upload</p>
            {files[name] && (
                <div className="mt-2 text-sm text-gray-600">
                    {(files[name] as File).name}
                    <button
                        onClick={() => removeFile(name)}
                        className="ml-2 text-red-600 hover:underline"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-center">Upload Your Documents (Amend)</h2>
            <p className="text-center text-gray-600">
                Upload your original DS-2019 and incorrect 1040 form in PDF or high-quality photo.
            </p>

            {/* Passport */}
            <Drop label="Passport" name="passport" />

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium mb-1">Country</h4>
                    <input
                        name="passportCountry"
                        value={form.passportCountry || ''}
                        onChange={handleInput}
                        placeholder="Country"
                        className="w-full border rounded px-4 py-2"
                    />
                </div>
                <div>
                    <h4 className="font-medium mb-1">Passport Number</h4>
                    <input
                        name="passportNumber"
                        value={form.passportNumber || ''}
                        onChange={handleInput}
                        placeholder="Number"
                        className="w-full border rounded px-4 py-2"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium mb-1">Issue Date</h4>
                    <input
                        type="date"
                        name="passportIssueDate"
                        value={form.passportIssueDate || ''}
                        onChange={handleInput}
                        className="w-full border rounded px-4 py-2"
                    />
                </div>
                <div>
                    <h4 className="font-medium mb-1">Expiry Date</h4>
                    <input
                        type="date"
                        name="passportExpiryDate"
                        value={form.passportExpiryDate || ''}
                        onChange={handleInput}
                        className="w-full border rounded px-4 py-2"
                    />
                </div>
            </div>

            {/* SSN */}
            <Drop label="SSN Card" name="ssnDoc" />

            <div>
                <h4 className="font-medium mb-1">SSN Number</h4>
                <input
                    name="ssnNumber"
                    value={form.ssnNumber || ''}
                    onChange={handleInput}
                    placeholder="SSN Number"
                    className="w-full border rounded px-4 py-2"
                />
            </div>

            {/* DS-2019 Optional */}
            <Drop label="DS-2019 (optional)" name="ds2019" required={false} />

            {/* Incorrect 1040 Form */}
            <Drop label="Incorrect 1040 Form" name="incorrect1040" required={true} />

            {/* W-2 Forms */}
            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 relative">
                <h3 className="text-lg font-semibold mb-2">W-2 Forms (if any)</h3>
                <label className="absolute inset-0 cursor-pointer">
                    <input
                        type="file"
                        name="w2"
                        multiple
                        onChange={e => {
                            const filesArr = Array.from(e.target.files || []);
                            setFiles(prev => ({ ...prev, w2: filesArr }));
                        }}
                        className="opacity-0 w-full h-full"
                    />
                </label>
                <CloudUpload className="mx-auto text-gray-500" size={36} />
                <p className="mt-2 text-sm text-gray-600">Click to upload multiple</p>
                {files.w2.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        {files.w2.map((f, i) => (
                            <li key={i}>
                                {f.name}
                                <button
                                    onClick={() =>
                                        setFiles(prev => ({
                                            ...prev,
                                            w2: prev.w2.filter((_, idx) => idx !== i)
                                        }))
                                    }
                                    className="ml-2 text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="text-center">
                {!submitted && (
                    <button
                        onClick={() => {
                            setSubmitted(true);
                            onNext();
                        }}
                        disabled={!valid}
                        className={`px-6 py-2 rounded-lg text-white font-semibold ${valid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
