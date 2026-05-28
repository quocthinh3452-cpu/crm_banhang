// app/crm/documents/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatDateTime } from '@/shared/utils/formatters';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { documentApi } from '@/modules/document/api/document.api';
import { Document } from '@/modules/document/types/document.type';
import toast from 'react-hot-toast';

// 1. Zod Schema cho validation
const documentSchema = z.object({
    name: z.string().min(2, 'Tên tài liệu phải có ít nhất 2 ký tự').max(200, 'Tên không quá 200 ký tự'),
    type: z.string().min(1, 'Loại tài liệu không được để trống').max(100, 'Loại không quá 100 ký tự'),
    version: z.string().min(1, 'Phiên bản không được để trống').max(20, 'Phiên bản không quá 20 ký tự'),
    releaseDate: z.string().optional().or(z.literal('')),
    expiryDate: z.string().optional().or(z.literal('')),
    file: z.any().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Banner alert thành công/lỗi
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Bộ lọc & Tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [versionFilter, setVersionFilter] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);

    // State Confirm Dialog Xóa
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteTargetName, setDeleteTargetName] = useState<string>('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<DocumentFormValues>({
        resolver: zodResolver(documentSchema),
    });

    // Tự động tắt thông báo lỗi/thành công sau 3 giây
    useEffect(() => {
        if (successMsg || errorMsg) {
            const timer = setTimeout(() => {
                setSuccessMsg(null);
                setErrorMsg(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMsg, errorMsg]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await documentApi.getAll();
            setDocuments(data || []);
        } catch (err) {
            console.error('Lỗi fetch data:', err);
            setErrorMsg("Không thể tải danh sách tài liệu.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenAdd = () => {
        setEditingDocument(null);
        reset({
            name: '',
            type: '',
            version: 'v1.0',
            releaseDate: '',
            expiryDate: '',
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (doc: Document) => {
        setEditingDocument(doc);
        reset({
            name: doc.name || '',
            type: doc.type || '',
            version: doc.version || '',
            releaseDate: doc.releaseDate || '',
            expiryDate: doc.expiryDate || '',
        });
        setIsModalOpen(true);
    };

    const onSubmit = async (data: DocumentFormValues) => {
        setIsSaving(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            const formData = new FormData();

            const requestData = {
                name: data.name,
                type: data.type,
                version: data.version,
                releaseDate: data.releaseDate ? data.releaseDate : null,
                expiryDate: data.expiryDate ? data.expiryDate : null,
            };

            formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }), 'data.json');

            if (data.file && data.file.length > 0) {
                formData.append('file', data.file[0]);
            } else if (!editingDocument) {
                // Thêm mới bắt buộc chọn file
                throw new Error("Vui lòng đính kèm tệp tin tài liệu.");
            }

            if (editingDocument) {
                await documentApi.update(editingDocument.id, formData);
                setSuccessMsg("Cập nhật tài liệu thành công!");
            } else {
                await documentApi.create(formData);
                setSuccessMsg("Thêm tài liệu mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            const backendError = error.response?.data;
            let msg = error.message || 'Có lỗi xảy ra khi lưu dữ liệu!';
            if (typeof backendError === 'string') {
                msg = backendError;
            } else if (backendError && typeof backendError.message === 'string') {
                msg = backendError.message;
            }

            // Đưa lỗi trực tiếp vào ô nhập liệu nếu trùng tên
            const lowerMsg = msg.toLowerCase();
            if (lowerMsg.includes("đã tồn tại") || lowerMsg.includes("trùng") || lowerMsg.includes("duplicate")) {
                setError("name", {
                    type: "manual",
                    message: "Mã/Tên tài liệu đã tồn tại, vui lòng chọn tên khác."
                });
            } else {
                setErrorMsg(msg);
            }
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenDelete = (doc: Document) => {
        setDeleteTargetId(doc.id);
        setDeleteTargetName(doc.name);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteTargetId === null) return;
        setConfirmLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            await documentApi.delete(deleteTargetId);
            setSuccessMsg("Xóa mềm tài liệu thành công!");
            fetchData();
        } catch (error: any) {
            const backendError = error.response?.data;
            setErrorMsg(typeof backendError === 'string' ? backendError : 'Lỗi khi xóa tài liệu.');
        } finally {
            setConfirmLoading(false);
            setIsConfirmOpen(false);
            setDeleteTargetId(null);
        }
    };

    // Tải về tài liệu
    const handleDownload = async (doc: Document) => {
        if (doc.filePath && doc.filePath.trim() !== '') {
            const fileUrl = doc.filePath.startsWith('http') ? doc.filePath : `http://localhost:8081${doc.filePath}`;
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error("Lỗi tải file từ Server");
                }
                
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = downloadUrl;
                
                const fileName = doc.filePath.split('/').pop() || doc.name;
                link.download = fileName;
                
                document.body.appendChild(link);
                link.click();
                
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);
            } catch (error) {
                console.error("Lỗi khi tải tài liệu:", error);
                toast.error("File tải về bị lỗi vui lòng cập nhật lại file");
            }
        } else {
            // Thông báo
            toast.error("Chưa có tài liệu vui lòng cập nhật tài liệu");
        }
    };

    // Client-side search, filters and sorting
    const filteredDocs = documents
        .filter(doc => {
            const matchesSearch = 
                doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (doc.type && doc.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                String(doc.id).includes(searchTerm);
            
            const matchesType = typeFilter === '' || doc.type === typeFilter;
            const matchesVersion = versionFilter === '' || doc.version === versionFilter;

            return matchesSearch && matchesType && matchesVersion;
        })
        .sort((a, b) => {
            const valA = a[sortField as keyof Document];
            const valB = b[sortField as keyof Document];

            if (valA === null || valA === undefined || valA === '') {
                return sortDir === 'asc' ? 1 : -1;
            }
            if (valB === null || valB === undefined || valB === '') {
                return sortDir === 'asc' ? -1 : 1;
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortDir === 'asc' 
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDir === 'asc' ? valA - valB : valB - valA;
            }

            return 0;
        });

    // Phân trang 6 dữ liệu trên 1 trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Reset về trang 1 khi thay đổi điều kiện tìm kiếm hoặc bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter, versionFilter]);

    const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;

    // Tự động điều chỉnh trang hiện tại nếu vượt quá tổng số trang do xóa bớt phần tử
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [filteredDocs.length, totalPages, currentPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);

    // Lấy danh sách duy nhất các loại tài liệu làm bộ lọc
    const uniqueTypes = Array.from(new Set(documents.map(d => d.type).filter(Boolean)));
    // Lấy danh sách duy nhất các phiên bản làm bộ lọc
    const uniqueVersions = Array.from(new Set(documents.map(d => d.version).filter(Boolean)));

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Tài liệu</h1>
                    <p className="text-sm text-gray-500">Tải lên, quản lý phiên bản, lưu trữ và theo dõi thời hạn tài liệu</p>
                </div>
                <Button onClick={handleOpenAdd}>
                    + Thêm tài liệu
                </Button>
            </div>

            {/* Thông báo Alert */}
            {successMsg && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center transition-all duration-300">
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            {errorMsg && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center transition-all duration-300">
                    <span className="font-medium">{errorMsg}</span>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 items-center justify-between">
                {/* Search Box */}
                <div className="relative w-full xl:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, ID hoặc loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-gray-700 placeholder-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Sort and Filters */}
                <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-end">
                    {/* Lọc theo phân loại */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-40 cursor-pointer transition-colors animate-fade-in"
                    >
                        <option value="">Tất cả phân loại</option>
                        {uniqueTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    {/* Lọc theo phiên bản */}
                    <select
                        value={versionFilter}
                        onChange={(e) => setVersionFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-36 cursor-pointer transition-colors"
                    >
                        <option value="">Tất cả phiên bản</option>
                        {uniqueVersions.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>

                    {/* Sắp xếp theo ngày hết hạn */}
                    <select
                        value={sortField === 'expiryDate' ? sortDir : ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setSortField('expiryDate');
                                setSortDir(val as 'asc' | 'desc');
                            } else {
                                setSortField('createdAt');
                                setSortDir('desc');
                            }
                        }}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-40 cursor-pointer transition-colors"
                    >
                        <option value="">Sắp xếp: Ngày hết hạn</option>
                        <option value="asc">Hết hạn: Gần nhất</option>
                        <option value="desc">Hết hạn: Xa nhất</option>
                    </select>

                    {/* Sắp xếp theo ngày phát hành */}
                    <select
                        value={sortField === 'releaseDate' ? sortDir : ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setSortField('releaseDate');
                                setSortDir(val as 'asc' | 'desc');
                            } else {
                                setSortField('createdAt');
                                setSortDir('desc');
                            }
                        }}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-44 cursor-pointer transition-colors"
                    >
                        <option value="">Sắp xếp: Ngày phát hành</option>
                        <option value="desc">Phát hành: Mới nhất</option>
                        <option value="asc">Phát hành: Cũ nhất</option>
                    </select>

                    {/* Sắp xếp theo ngày tạo */}
                    <select
                        value={sortField === 'createdAt' ? sortDir : ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setSortField('createdAt');
                                setSortDir(val as 'asc' | 'desc');
                            } else {
                                setSortField('createdAt');
                                setSortDir('desc');
                            }
                        }}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-40 cursor-pointer transition-colors"
                    >
                        <option value="">Sắp xếp: Ngày tạo</option>
                        <option value="desc">Ngày tạo: Mới nhất</option>
                        <option value="asc">Ngày tạo: Cũ nhất</option>
                    </select>
                </div>
            </div>

            {/* Bảng Danh sách Tài liệu */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 w-16">ID</th>
                                <th className="p-4 font-semibold text-gray-600">Tên tài liệu</th>
                                <th className="p-4 font-semibold text-gray-600">Loại tài liệu</th>
                                <th className="p-4 font-semibold text-gray-600 w-24">Phiên bản</th>
                                <th className="p-4 font-semibold text-gray-600 w-32">Ngày phát hành</th>
                                <th className="p-4 font-semibold text-gray-600 w-32">Ngày hết hạn</th>
                                <th className="p-4 font-semibold text-gray-600 w-32">Ngày tạo</th>
                                <th className="p-4 font-semibold text-gray-600 text-center w-24">Tải về</th>
                                <th className="p-4 font-semibold text-gray-600 text-center w-40">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                // Loading Skeleton
                                [1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-4"><Skeleton className="h-4 w-8" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-4"><Skeleton className="h-8 w-12 mx-auto rounded" /></td>
                                        <td className="p-4"><Skeleton className="h-8 w-24 mx-auto rounded" /></td>
                                    </tr>
                                ))
                            ) : currentDocs.length > 0 ? (
                                currentDocs.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-500">#{item.id}</td>
                                        <td className="p-4 font-medium text-gray-900 truncate max-w-[200px]">{item.name}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 text-xs bg-sky-50 text-sky-700 border border-sky-100 rounded-full font-medium">
                                                {item.type || 'Chưa phân loại'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-gray-700 font-mono">{item.version}</td>
                                        <td className="p-4 text-sm text-gray-600">{item.releaseDate || '---'}</td>
                                        <td className="p-4 text-sm text-gray-600">{item.expiryDate || '---'}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {item.createdAt ? formatDateTime(item.createdAt) : '---'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDownload(item)}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                                                    item.filePath 
                                                        ? 'bg-sky-100 text-sky-700 hover:bg-sky-200' 
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 border border-gray-200'
                                                }`}
                                                title={item.filePath ? "Tải tài liệu xuống" : "Chưa có tài liệu - Click để nhận thông báo"}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="outline" className="text-xs px-3 h-8" onClick={() => handleOpenEdit(item)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                    <path d="m15 5 4 4" />
                                                </svg>
                                                </Button>
                                                <Button variant="outline" className="text-xs px-3 h-8 text-red-600 hove r:bg-red-50 hover:border-red-200" onClick={() => handleOpenDelete(item)}>
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    <line x1="10" x2="10" y1="11" y2="17" />
                                                    <line x1="14" x2="14" y1="11" y2="17" />
                                                </svg>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="p-10 text-center text-gray-500">
                                        Không tìm thấy tài liệu nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!isLoading && filteredDocs.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={filteredDocs.length}
                    pageSize={itemsPerPage}
                    onPageChange={(p) => setCurrentPage(p)}
                />
            )}

            {/* Modal Form Thêm/Sửa */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDocument ? "Chỉnh sửa tài liệu" : "Tải lên tài liệu mới"}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="space-y-4 overflow-y-auto max-h-[58vh] pr-2 pb-2 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Tên tài liệu"
                                placeholder="VD: Hợp đồng đại lý..."
                                {...register('name')}
                                error={errors.name?.message}
                            />

                            <TextInput
                                label="Loại tài liệu"
                                placeholder="VD: Hợp đồng, Biểu mẫu..."
                                {...register('type')}
                                error={errors.type?.message}
                            />

                            <TextInput
                                label="Phiên bản"
                                placeholder="VD: v1.0"
                                {...register('version')}
                                error={errors.version?.message}
                            />

                            <TextInput
                                label="Ngày phát hành"
                                type="date"
                                {...register('releaseDate')}
                                error={errors.releaseDate?.message}
                            />

                            <TextInput
                                label="Ngày hết hạn"
                                type="date"
                                {...register('expiryDate')}
                                error={errors.expiryDate?.message}
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tệp đính kèm {!editingDocument && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                key={isModalOpen ? 'open' : 'closed'}
                                type="file"
                                {...register('file')}
                                className="block w-full text-sm text-gray-500 
                                           file:mr-4 file:py-2 file:px-4 
                                           file:rounded-md file:border-0 
                                           file:text-sm file:font-semibold 
                                           file:bg-sky-100 file:text-sky-700 
                                           hover:file:bg-sky-200 cursor-pointer"
                            />
                            <p className="text-xs text-gray-400 mt-2">Định dạng hỗ trợ: PDF, DOCX, XLSX, JPG, PNG. Dung lượng tối đa 10MB.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Đang xử lý...' : (editingDocument ? 'Cập nhật' : 'Lưu tài liệu')}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Dialog Xóa */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Xác nhận xóa tài liệu"
                message={`Bạn có chắc chắn muốn xóa (xóa mềm) tài liệu này? Hành động này có thể khôi phục sau.`}
                itemName={deleteTargetName}
                onCancel={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={confirmLoading}
                confirmText="Xác nhận xóa"
            />
        </div>
    );
}
