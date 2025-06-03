// src/app/tax-refund/components/FormFiles/UploadDocumentsFile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CloudUpload } from 'lucide-react';

type FilesRecord = {
    passport: File | null;
    ssnDoc: File | null;
    ds2019: File | null;
    w2: File[];
};

interface UploadDocumentsProps {
    form: Record<string, any>;
    files: FilesRecord;
    setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setFiles: React.Dispatch<React.SetStateAction<FilesRecord>>;
    onNext: () => void;
}

export default function UploadDocumentsFile({ form, files, setValues, setFiles, onNext }: UploadDocumentsProps) {
    const [valid, setValid] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const ok = Boolean(
            files.passport &&
            files.ssnDoc &&
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
        const { name, files: f, multiple } = e.target;
        if (!f) return;
        const sel = multiple ? Array.from(f) : f[0];
        setFiles(prev => ({ ...prev, [name]: sel }));
    };

    const remove = (name: keyof FilesRecord, i?: number) => {
        setFiles(prev => {
            if (name === 'w2' && typeof i === 'number') {
                const arr = prev.w2.filter((_, idx) => idx !== i);
                return { ...prev, w2: arr };
            }
            return { ...prev, [name]: null };
        });
    };

    const Drop: React.FC<{ label: string; name: keyof FilesRecord; multiple?: boolean }> = ({ label, name, multiple }) => (
        <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 relative">
            <h3 className="text-lg font-semibold mb-2">{label}</h3>
            <label className="absolute inset-0 cursor-pointer z-10">
                <input type="file" name={name} multiple={multiple} onChange={handleFile} className="opacity-0 w-full h-full" />
            </label>
            <CloudUpload className="mx-auto text-gray-500" size={36} />
            <p className="mt-2 text-sm text-gray-600">Click to upload</p>
            {/* Single file preview */}
            {!multiple && files[name] && (
                <div className="mt-2 text-sm text-gray-600">
                    {(files[name] as File).name}
                    <button onClick={() => remove(name)} className="ml-2 text-red-600">Remove</button>
                </div>
            )}
            {/* Multiple files preview */}
            {multiple && Array.isArray(files.w2) && files.w2.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {files.w2.map((f, i) => (
                        <li key={i}>
                            {f.name}
                            <button onClick={() => remove('w2', i)} className="ml-2 text-red-600">Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-center">Upload Your Documents</h2>
            <p className="text-center text-gray-600">Upload your documents in high-quality PDF or photo.</p>

            <Drop label="Passport" name="passport" />
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium mb-1">Country</h4>
                    <input name="passportCountry" value={form.passportCountry || ''} onChange={handleInput}
                        placeholder="Country" className="w-full border rounded px-4 py-2" />
                </div>
                <div>
                    <h4 className="font-medium mb-1">Passport Number</h4>
                    <input name="passportNumber" value={form.passportNumber || ''} onChange={handleInput}
                        placeholder="Number" className="w-full border rounded px-4 py-2" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-medium mb-1">Issue Date</h4>
                    <input type="date" name="passportIssueDate" value={form.passportIssueDate || ''}
                        onChange={handleInput} className="w-full border rounded px-4 py-2" />
                </div>
                <div>
                    <h4 className="font-medium mb-1">Expiry Date</h4>
                    <input type="date" name="passportExpiryDate" value={form.passportExpiryDate || ''}
                        onChange={handleInput} className="w-full border rounded px-4 py-2" />
                </div>
            </div>

            <Drop label="SSN Card" name="ssnDoc" />
            <div>
                <h4 className="font-medium mb-1">SSN Number</h4>
                <input name="ssnNumber" value={form.ssnNumber || ''} onChange={handleInput}
                    placeholder="SSN Number" className="w-full border rounded px-4 py-2" />
            </div>

            <Drop label="DS-2019 (optional)" name="ds2019" />

            {/* New DS-2019 dates fields */}
            <div>
                <p className="font-medium mb-2">Ingrese las fechas de su DS-2019, fecha de inicio y fecha de finalización de su programa, como lo marca en el DS-2019:</p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-medium mb-1">Fecha de Inicio</label>
                        <input
                            type="date"
                            name="ds2019StartDate"
                            value={form.ds2019StartDate || ''}
                            onChange={handleInput}
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Fecha de Finalización</label>
                        <input
                            type="date"
                            name="ds2019EndDate"
                            value={form.ds2019EndDate || ''}
                            onChange={handleInput}
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>
                </div>
            </div>

            <Drop label="W-2 Forms" name="w2" multiple />

            <div className="text-center">
                {!submitted && (
                    <button
                        onClick={() => { setSubmitted(true); onNext(); }}
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
