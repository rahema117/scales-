import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Eye, Download, Calendar, CheckCircle, XCircle, FileWarning, CalendarPlus, CheckSquare, MessageSquare, Scale, Loader2, ArrowRight } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';
const UPLOADS_BASE = 'http://localhost:5000/uploads';

export default function RequestsManager() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Action Forms State
  const [adminNotes, setAdminNotes] = useState('');
  const [appointment, setAppointment] = useState({ date: '', time: '' });
  const [completeForm, setCompleteForm] = useState({ calibrationDate: '', scalesCount: '1' });

  const fetchRequests = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.get(`${API_BASE}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRequests(response.data.data);
        applyFilter(response.data.data, statusFilter);
      } else {
        setErrorMsg('فشل استيراد قائمة الطلبات');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('خطأ في الاتصال بالخادم لتحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const applyFilter = (allData, filter) => {
    if (filter === 'all') {
      setFilteredRequests(allData);
    } else {
      setFilteredRequests(allData.filter(r => r.status === filter));
    }
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    applyFilter(requests, filter);
  };

  const handleSelectRequest = (req) => {
    setSelectedRequest(req);
    setAdminNotes(req.adminNotes || '');
    setAppointment({
      date: req.appointmentDate || '',
      time: req.appointmentTime || ''
    });
    setCompleteForm({
      calibrationDate: new Date().toISOString().split('T')[0],
      scalesCount: req.scalesCount || '1'
    });
  };

  // Action: Update request status directly (e.g. approve/reject/missing docs)
  const handleUpdateStatus = async (status) => {
    setActionLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.put(`${API_BASE}/requests/${selectedRequest._id}`, {
        status,
        adminNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedRequest(response.data.data);
        // refresh list
        await fetchRequests();
        alert('تم تحديث حالة الطلب بنجاح');
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Schedule appointment
  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!appointment.date || !appointment.time) {
      alert('يرجى اختيار التاريخ والوقت لتحديد الموعد');
      return;
    }

    setActionLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.put(`${API_BASE}/requests/${selectedRequest._id}`, {
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        adminNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedRequest(response.data.data);
        await fetchRequests();
        alert('تم حجز الموعد بنجاح وإشعار حالة الطلب بالتحديث');
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء جدولة موعد المعايرة');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Complete calibration
  const handleCompleteCalibration = async (e) => {
    e.preventDefault();
    if (!completeForm.calibrationDate) {
      alert('يرجى اختيار تاريخ إتمام المعايرة الفعلي');
      return;
    }

    setActionLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.put(`${API_BASE}/requests/${selectedRequest._id}/complete`, {
        calibrationDate: completeForm.calibrationDate,
        scalesCount: parseInt(completeForm.scalesCount, 10),
        adminNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedRequest(response.data.data.request);
        await fetchRequests();
        alert('تم تسجيل انتهاء المعايرة والدمغ وتحديث سجلات الشركة تلقائيًا');
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ تفاصيل إتمام عملية الدمغ');
    } finally {
      setActionLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'تم استلام الطلب', label: 'تم الاستلام' },
    { value: 'قيد المراجعة', label: 'قيد المراجعة' },
    { value: 'مستندات ناقصة', label: 'مستندات ناقصة' },
    { value: 'تم تحديد موعد', label: 'تم تحديد موعد' },
    { value: 'تم تنفيذ الدمغ والمعايرة', label: 'تم التنفيذ' },
    { value: 'مرفوض', label: 'مرفوض' }
  ];

  return (
    <div className="space-y-6 text-right select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gov-dark">إدارة طلبات الدمغ والمعايرة</h1>
        <p className="text-xs text-gray-500 mt-1">مراجعة الملفات المرفوعة، حجز مواعيد التفتيش، وإثبات نتائج المعايرة الفنية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* REQUESTS LIST - Col 7 */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFilterChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                  statusFilter === opt.value
                    ? 'bg-gov-primary text-gov-gold shadow-sm'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Table Container */}
          {isLoading ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-gov-primary animate-spin" />
              <span className="text-xs text-gray-400">جاري تحميل الطلبات الرسمية...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-light">
              لا توجد طلبات تطابق الفلترة الحالية.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500">
                    <th className="p-3 text-right">رقم الطلب</th>
                    <th className="p-3 text-right">الشركة</th>
                    <th className="p-3 text-center">الموازين</th>
                    <th className="p-3 text-center">تاريخ التقديم</th>
                    <th className="p-3 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req._id}
                      onClick={() => handleSelectRequest(req)}
                      className={`hover:bg-gov-light/35 cursor-pointer transition-colors ${
                        selectedRequest?._id === req._id ? 'bg-gov-light/60 border-r-4 border-gov-gold' : ''
                      }`}
                    >
                      <td className="p-3 font-semibold font-mono text-gov-primary">{req.requestNumber}</td>
                      <td className="p-3 max-w-[150px] truncate">{req.companyName}</td>
                      <td className="p-3 text-center">{req.scalesCount} ميزان</td>
                      <td className="p-3 text-center font-mono text-gray-400">
                        {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          req.status === 'تم تنفيذ الدمغ والمعايرة' ? 'bg-green-100 text-green-800' :
                          req.status === 'تم تحديد موعد' ? 'bg-gov-goldLight text-gov-dark' :
                          req.status === 'مستندات ناقصة' ? 'bg-orange-100 text-orange-800' :
                          req.status === 'مرفوض' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DETAILS PANEL - Col 5 */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
          {selectedRequest ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Title */}
              <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gov-dark">{selectedRequest.companyName}</h3>
                  <span className="text-xs text-gray-400 font-mono">الطلب: {selectedRequest.requestNumber}</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md font-mono">
                  {new Date(selectedRequest.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>

              {/* Info Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">اسم المسؤول</span>
                  <span className="font-bold text-gray-700">{selectedRequest.responsiblePerson}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">رقم الهاتف</span>
                  <span className="font-bold text-gray-700 font-mono">{selectedRequest.phone}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">العنوان</span>
                  <span className="font-bold text-gray-700">{selectedRequest.address}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">السجل التجاري</span>
                  <span className="font-bold text-gray-700 font-mono">{selectedRequest.commercialRegister}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">البطاقة الضريبية</span>
                  <span className="font-bold text-gray-700 font-mono">{selectedRequest.taxCardNumber}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">أنواع الموازين</span>
                  <span className="font-bold text-gray-700">{selectedRequest.scalesTypes}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-gray-400">ملاحظات مقدم الطلب</span>
                  <span className="font-bold text-gray-600 text-right max-w-[200px]">{selectedRequest.notes || 'لا يوجد'}</span>
                </div>
              </div>

              {/* Uploaded Files Section */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-150">
                <h4 className="font-bold text-xs text-gov-primary flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gov-gold" />
                  <span>المستندات الرسمية المرفقة</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {Object.keys(selectedRequest.files).map((key) => {
                    const filename = selectedRequest.files[key];
                    const labelMap = {
                      requestFile: 'طلب الدمغ والمعايرة الرسمى',
                      authorizationFile: 'طلب تفويض المندوب',
                      commercialRegisterFile: 'صورة السجل التجاري',
                      taxCardFile: 'صورة البطاقة الضريبية'
                    };
                    return (
                      <div key={key} className="bg-white p-2.5 rounded-lg border border-gray-150 flex items-center justify-between">
                        <span className="font-semibold text-gray-600 text-[11px] truncate max-w-[160px]" title={labelMap[key]}>
                          {labelMap[key]}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={`${UPLOADS_BASE}/${filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-gov-light text-gov-primary hover:bg-gov-primary hover:text-white rounded-md transition-colors"
                            title="عرض في المتصفح"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`${UPLOADS_BASE}/${filename}`}
                            download
                            className="p-1 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
                            title="تحميل الملف"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status and Actions Forms */}
              <div className="border-t border-gray-100 pt-5 space-y-4">
                
                {/* Notes Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-gov-gold" />
                    <span>ملاحظات الإدارة والقرارات:</span>
                  </label>
                  <textarea
                    rows="2"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="اكتب ملاحظاتك الإدارية أو أسباب الرفض أو النقص..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-gov-primary focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Direct Status Buttons (Only if not already completed) */}
                {selectedRequest.status !== 'تم تنفيذ الدمغ والمعايرة' && (
                  <div className="flex flex-wrap gap-2 pt-2.5">
                    <button
                      onClick={() => handleUpdateStatus('قيد المراجعة')}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all focus:outline-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>قيد المراجعة</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('مستندات ناقصة')}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-orange-50 text-orange-800 hover:bg-orange-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all focus:outline-none"
                    >
                      <FileWarning className="w-3.5 h-3.5" />
                      <span>مستندات ناقصة</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('مرفوض')}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-red-50 text-red-800 hover:bg-red-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all focus:outline-none"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رفض الطلب</span>
                    </button>
                  </div>
                )}

                {/* SCHEDULE CALIBRATION FORM */}
                {selectedRequest.status !== 'تم تنفيذ الدمغ والمعايرة' && selectedRequest.status !== 'مرفوض' && (
                  <form onSubmit={handleSchedule} className="bg-gov-light/30 border border-gov-primary/10 rounded-2xl p-4.5 space-y-3">
                    <h4 className="font-bold text-xs text-gov-primary flex items-center gap-1.5">
                      <CalendarPlus className="w-4 h-4 text-gov-gold" />
                      <span>جدولة موعد زيارة المعايرة الفنية</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-gray-400 font-semibold">تاريخ الزيارة</span>
                        <input
                          type="date"
                          value={appointment.date}
                          onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-gray-400 font-semibold">توقيت تقريبي</span>
                        <input
                          type="text"
                          placeholder="مثال: الساعة 10 صباحًا"
                          value={appointment.time}
                          onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full py-2 bg-gov-primary hover:bg-gov-dark text-white rounded-lg font-bold text-xs transition-all flex justify-center items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>تثبيت الموعد</span>
                    </button>
                  </form>
                )}

                {/* RECORD CALIBRATION COMPLETION FORM */}
                {selectedRequest.status === 'تم تحديد موعد' && (
                  <form onSubmit={handleCompleteCalibration} className="bg-green-50/50 border border-green-200 rounded-2xl p-4.5 space-y-3">
                    <h4 className="font-bold text-xs text-green-900 flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-gov-gold" />
                      <span>تسجيل إتمام المعايرة والدمغ</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-gray-400 font-semibold">تاريخ الإتمام الفعلي</span>
                        <input
                          type="date"
                          value={completeForm.calibrationDate}
                          onChange={(e) => setCompleteForm({ ...completeForm, calibrationDate: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-gray-400 font-semibold">عدد الموازين المطابقة</span>
                        <input
                          type="number"
                          min="1"
                          value={completeForm.scalesCount}
                          onChange={(e) => setCompleteForm({ ...completeForm, scalesCount: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-bold text-xs transition-all flex justify-center items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>حفظ المعايرة وإنشاء سجل سريان لعام كامل</span>
                    </button>
                  </form>
                )}

                {selectedRequest.status === 'تم تنفيذ الدمغ والمعايرة' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-semibold flex gap-2 items-start leading-normal">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <strong>تم إتمام الإجراء الفني بنجاح:</strong> تم إجراء المعايرة والدمغ لهذه المنشأة. السجل الخاص بها سارٍ ومجدول في قاعدة بيانات الشركات التلقائية حتى تاريخ انتهاء سريان المعايرة.
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400 font-light text-center gap-3">
              <Scale className="w-12 h-12 text-gray-300 animate-pulse" />
              <span>اختر طلباً من القائمة بالجانب لعرض التفاصيل وتنزيل المرفقات واتخاذ القرارات الإدارية.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
