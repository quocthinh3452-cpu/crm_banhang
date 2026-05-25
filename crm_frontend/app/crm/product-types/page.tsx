// app/crm/product-types/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { productTypeApi } from '@/modules/product/api/productType.api';
import { ProductTypeResponse } from '@/modules/product/types/productType.type';

export default function ProductTypesPage() {
    const [productTypes, setProductTypes] = useState<ProductTypeResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // State cho form thêm mới
    const [newTypeName, setNewTypeName] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Load danh sách khi vào trang
    useEffect(() => {
        fetchProductTypes();
    }, []);

    const fetchProductTypes = async () => {
        setIsLoading(true);
        try {
            const data = await productTypeApi.getAll();
            setProductTypes(data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            setErrorMsg("Không thể tải danh sách loại sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTypeName.trim()) return;

        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            // Gọi API thêm mới
            await productTypeApi.create({
                typeName: newTypeName,
                isActive: 1
            });
            setSuccessMsg("Thêm loại sản phẩm thành công!");
            setNewTypeName(''); // Reset form
            fetchProductTypes(); // Load lại danh sách
        } catch (error: any) {
            // Bắt lỗi từ Backend (ví dụ lỗi 400 - trùng tên)
            const errorResponse = error.response?.data;
            setErrorMsg(typeof errorResponse === 'string' ? errorResponse : "Đã xảy ra lỗi khi thêm mới.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            await productTypeApi.delete(id);
            setSuccessMsg("Xóa danh mục thành công!");
            fetchProductTypes(); // Load lại danh sách
        } catch (error: any) {
            // Bắt lỗi từ Backend (ví dụ lỗi 409 - đang chứa sản phẩm)
            const errorResponse = error.response?.data;
            setErrorMsg(typeof errorResponse === 'string' ? errorResponse : "Không thể xóa danh mục này.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Quản lý Loại Sản Phẩm</h1>

            {/* Hiển thị thông báo thành công / lỗi */}
            {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>}
            {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>}

            {/* Form thêm mới */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-3">Thêm loại sản phẩm mới</h2>
                <form onSubmit={handleCreate} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập tên loại sản phẩm..."
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                        disabled={!newTypeName.trim()}
                    >
                        Thêm mới
                    </button>
                </form>
            </div>

            {/* Danh sách */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">ID</th>
                                <th className="p-4 font-semibold text-gray-600">Tên Loại Sản Phẩm</th>
                                {/* THÊM CỘT TRẠNG THÁI TẠI ĐÂY */}
                                <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                                <th className="p-4 font-semibold text-gray-600 w-24">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        Chưa có dữ liệu.
                                    </td>
                                </tr>
                            ) : (
                                productTypes.map((type) => (
                                    <tr key={type.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 text-gray-500">#{type.id}</td>

                                        {/* ĐỔI type.name THÀNH type.typeName Ở ĐÂY */}
                                        <td className="p-4 font-medium">{type.typeName}</td>

                                        {/* Cột isActive như chúng ta đã làm ở bước trước */}
                                        <td className="p-4">
                                            {type.isActive === 1 ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                    Hoạt động
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                                    Ngừng hoạt động
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDelete(type.id)}
                                                className="text-red-500 hover:text-red-700 font-medium"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}