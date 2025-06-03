// src/app/tax-refund/components/FormFiles/FormFile.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import TaxDetailsFile from './FormFiles/TaxDetailsFile';
import AdditionalInformation from './FormFiles/AdditionalInformation';
import UploadDocumentsFile from './FormFiles/UploadDocumentsFile';
import BankInformation from './FormFiles/BankInformation';
import Address from './FormFiles/Address';
import Confirmation from './FormFiles/Confirmation';

interface FilesRecord {
    passport: File | null;
    ssnDoc: File | null;
    ds2019: File | null;
    w2: File[];
}

interface FormFileProps {
    form: {
        firstName: string;
        lastName: string;
        email: string;
        service: 'file' | 'amend' | '';
    };
    initialStep?: number;
}

const FormFile: React.FC<FormFileProps> = ({ form, initialStep = 2 }) => {
    const [step, setStep] = useState(initialStep);

    const [values, setValues] = useState({
        // Valores iniciales desde la página padre
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        service: form.service,
        // Propiedades que pide TaxDetailsFile
        year: '',
        state: '',
        entryDate: '',
        exitDate: '',
        filedPrevious: '',
        previousDetails: '',
        // Additional Information
        sponsor: '',
        university: '',
        universityAddress: '',
        // Para los documentos
        passportCountry: '',
        passportNumber: '',
        passportIssueDate: '',
        passportExpiryDate: '',
        ssnNumber: '',
        // Datos bancarios
        bankName: '',
        routingNumber: '',
        accountNumber: '',
        accountType: '',
        accountOwner: '',
        // Dirección
        street: '',
        city: '',
        zip: '',
    });

    const [files, setFiles] = useState<FilesRecord>({
        passport: null,
        ssnDoc: null,
        ds2019: null,
        w2: [],
    });

    // Refs para hacer scroll automático
    const stepRefs: Record<number, React.RefObject<HTMLDivElement>> = {
        2: useRef<HTMLDivElement>(null),
        3: useRef<HTMLDivElement>(null),
        4: useRef<HTMLDivElement>(null),
        5: useRef<HTMLDivElement>(null),
        6: useRef<HTMLDivElement>(null),
        7: useRef<HTMLDivElement>(null),
    };

    useEffect(() => {
        stepRefs[step]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [step]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="mt-10 space-y-12">
            {/* Paso 2: Tax Details */}
            {step >= 2 && (
                <div ref={stepRefs[2]}>
                    <TaxDetailsFile
                        form={{
                            year: values.year,
                            state: values.state,
                            entryDate: values.entryDate,
                            exitDate: values.exitDate,
                            filedPrevious: values.filedPrevious,
                            previousDetails: values.previousDetails,
                        }}
                        onChange={handleChange}
                        onNext={() => setStep(3)}
                    />
                </div>
            )}

            {/* Paso 3: Additional Information */}
            {step >= 3 && (
                <div ref={stepRefs[3]}>
                    <AdditionalInformation
                        values={{
                            sponsor: values.sponsor,
                            university: values.university,
                            universityAddress: values.universityAddress,
                        }}
                        onChange={(e) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        onNext={() => setStep(4)}
                    />
                </div>
            )}

            {/* Paso 4: Upload Documents */}
            {step >= 4 && (
                <div ref={stepRefs[4]}>
                    <UploadDocumentsFile
                        form={values}
                        files={files}
                        setValues={setValues}
                        setFiles={setFiles}
                        onNext={() => setStep(5)}
                    />
                </div>
            )}

            {/* Paso 5: Bank Information */}
            {step >= 5 && (
                <div ref={stepRefs[5]}>
                    <BankInformation
                        values={{
                            bankName: values.bankName,
                            routingNumber: values.routingNumber,
                            accountNumber: values.accountNumber,
                            accountType: values.accountType,
                            accountOwner: values.accountOwner,
                        }}
                        onChange={handleChange}
                        onNext={() => setStep(6)}
                    />
                </div>
            )}

            {/* Paso 6: Address */}
            {step >= 6 && (
                <div ref={stepRefs[6]}>
                    <Address
                        values={{
                            street: values.street,
                            city: values.city,
                            zip: values.zip,
                        }}
                        setValues={setValues}
                        onNext={() => setStep(7)}
                    />
                </div>
            )}

            {/* Paso 7: Confirmation */}
            {step >= 7 && (
                <div ref={stepRefs[7]}>
                    <Confirmation
                        values={{
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            service: values.service as 'file' | 'amend',
                            year: values.year,
                            state: values.state,
                        }}
                        onFinish={() => {/* aquí podrías enviar al pago o terminar */ }}
                    />
                </div>
            )}
        </div>
    );
};

export default FormFile;
