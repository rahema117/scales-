import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle2, AlertTriangle, Building, User, Phone, Mail, MapPin, ClipboardList, Scale, Info, ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export default function NewRequest() {
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    responsiblePerson: '',
    phone: '',
    email: '',
    address: '',
    commercialRegister: '',
    taxCardNumber: '',
    scalesCount: '1',
    scalesTypes: '',
    notes: '',
  });

  // Files State
  const [files, setFiles] = useState({
    requestFile: null,
    authorizationFile: null,
    commercialRegisterFile: null,
    taxCardFile: null
  });

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null); // stores { requestNumber, message }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!['.pdf', '.jpg', '.jpeg', '.png'].includes(ext)) {
        setErrorMsg('نوع الملف غير مدعوم. المسموح به فقط: PDF, JPG, PNG');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت للملف الواحد.');
        return;
      }
      setErrorMsg('');
      setFiles({ ...files, [fileKey]: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Client-side validations
    if (
      !formData.companyName ||
      !formData.responsiblePerson ||
      !formData.phone ||
      !formData.address ||
      !formData.commercialRegister ||
      !formData.taxCardNumber ||
      !formData.scalesCount ||
      !formData.scalesTypes
    ) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة المميزة بنجمة (*)');
      setIsLoading(false);
      return;
    }

    if (
      !files.requestFile ||
      !files.authorizationFile ||
      !files.commercialRegisterFile ||
      !files.taxCardFile
    ) {
      setErrorMsg('يرجى تحميل كافة المرفقات والمستندات الأربعة المطلوبة');
      setIsLoading(false);
      return;
    }

    // Prepare Multipart Form Data
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    Object.keys(files).forEach((key) => {
      data.append(key, files[key]);
    });

    try {
      const response = await axios.post(`${API_BASE}/requests`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccessData({
          requestNumber: response.data.requestNumber,
          message: response.data.message
        });
      } else {
        setErrorMsg(response.data.message || 'فشل تقديم الطلب. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(
        err.response?.data?.message || 
        'خطأ في الاتصال بالخادم. يرجى التأكد من تشغيل خادم النظام والمحاولة لاحقاً.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // SUCCESS SCREEN
  if (successData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-right">
        <div className="bg-white rounded-3xl shadow-xl border border-gov-primary/10 overflow-hidden printable-area">
          {/* Header Bar */}
          <div className="bg-gov-dark text-white p-6 text-center border-b-4 border-gov-gold">
            <h2 className="text-xl font-bold">بوابة مصلحة الدمغ والموازين الإلكترونية</h2>
            <p className="text-xs text-gov-gold mt-1">إيصال استلام طلب معايرة موازين رقمي</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-gov-secondary animate-bounce" />
              <h3 className="text-2xl font-bold text-gov-dark">تم تقديم الطلب بنجاح</h3>
              <p className="text-sm text-gray-500 max-w-md">
                {successData.message}
              </p>
            </div>

            {/* Ticket Details */}
            <div className="bg-gov-light/40 border border-gov-primary/10 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gov-primary/10 pb-3">
                <span className="text-sm text-gray-500">رقم الطلب الفريد</span>
                <span className="text-xl font-extrabold text-gov-primary font-mono tracking-wider">
                  {successData.requestNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2.5">
                <span className="text-gray-500">اسم الشركة</span>
                <span className="font-bold text-gov-dark">{formData.companyName}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2.5">
                <span className="text-gray-500">رقم السجل التجاري</span>
                <span className="font-bold text-gov-dark font-mono">{formData.commercialRegister}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2.5">
                <span className="text-gray-500">اسم المسؤول</span>
                <span className="font-bold text-gov-dark">{formData.responsiblePerson}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2.5">
                <span className="text-gray-500">رقم الهاتف</span>
                <span className="font-bold text-gov-dark font-mono">{formData.phone}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">حالة الطلب الافتراضية</span>
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  تم استلام الطلب
                </span>
              </div>
            </div>

            {/* Note & Actions */}
            <div className="bg-gov-goldLight/30 border border-gov-gold/30 rounded-xl p-4 flex gap-3 text-sm text-gov-dark items-start leading-relaxed">
              <Info className="w-5 h-5 text-gov-gold shrink-0 mt-0.5" />
              <div>
                <strong>تنبيه هام:</strong> يرجى طباعة أو الاحتفاظ برقم هذا الطلب للتمكن من الاستعلام عن حالته ومواعيد زيارة المفتش لاحقاً عبر رابط "الاستعلام عن طلب".
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 no-print">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-6 bg-gov-dark hover:bg-gov-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-transparent shadow transition-all focus:outline-none"
              >
                <Printer className="w-5 h-5" />
                <span>طباعة إيصال الاستلام</span>
              </button>
              <Link
                to="/"
                className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORM INPUT GROUP COMPONENT
  const renderInput = (label, name, icon, type = 'text', required = true) => {
    const Icon = icon;
    return (
      <div className="flex flex-col gap-2 text-right">
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gov-primary focus:bg-white focus:ring-2 focus:ring-gov-primary/10 transition-all text-right font-medium text-gray-800 focus:outline-none"
            placeholder={label}
            required={required}
          />
          <div className="absolute right-4 top-3.5 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  };

  // FILE UPLOAD CARD COMPONENT
  const renderFileUpload = (label, fileKey) => {
    const file = files[fileKey];
    return (
      <div className="flex flex-col gap-2 text-right bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
        <label className="text-sm font-bold text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
        
        <div className="relative border-2 border-dashed border-gray-200 hover:border-gov-primary/40 rounded-xl transition-all p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[120px] bg-gray-50">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, fileKey)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-gov-secondary" />
              <span className="text-xs font-semibold text-gov-dark max-w-[200px] truncate" title={file.name}>
                {file.name}
              </span>
              <span className="text-[10px] text-gray-400">
                {(file.size / (1024 * 1024)).toFixed(2)} ميجابايت
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400 animate-pulse" />
              <span className="text-xs font-semibold text-gray-600">اختر الملف أو اسحبه هنا</span>
              <span className="text-[10px] text-gray-400">صيغ: PDF, JPG, PNG (أقصى 5MB)</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-right">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex p-3 bg-gov-light rounded-2xl text-gov-primary">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gov-dark">تقديم طلب دمغ ومعايرة الموازين</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-light">
          يرجى تعبئة كافة الحقول بشكل صحيح ورفع المستندات الرسمية المعتمدة لإتمام تسجيل الطلب وإرساله للتفتيش.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex gap-3 items-start animate-shake">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Card 1: Company Info */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gov-primary border-r-4 border-gov-gold pr-3 leading-none mb-2">
            بيانات المنشأة التجارية والمسؤول
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('اسم الشركة بالكامل', 'companyName', Building)}
            {renderInput('اسم المسؤول المكلف بمتابعة الطلب', 'responsiblePerson', User)}
            {renderInput('رقم الهاتف للتواصل المباشر', 'phone', Phone, 'tel')}
            {renderInput('البريد الإلكتروني (اختياري)', 'email', Mail, 'email', false)}
            {renderInput('رقم السجل التجاري للشركة', 'commercialRegister', ClipboardList)}
            {renderInput('رقم البطاقة الضريبية', 'taxCardNumber', ClipboardList)}
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {renderInput('العنوان التفصيلي للشركة بمدينة العبور', 'address', MapPin)}
          </div>
        </div>

        {/* Card 2: Scales Info */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gov-primary border-r-4 border-gov-gold pr-3 leading-none mb-2">
            تفاصيل الموازين المطلوب معايرتها
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 text-right md:col-span-1">
              <label className="text-sm font-semibold text-gray-700">
                عدد الموازين المطلوب دمغها <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="scalesCount"
                  min="1"
                  value={formData.scalesCount}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gov-primary focus:bg-white focus:ring-2 focus:ring-gov-primary/10 transition-all text-right font-medium text-gov-dark focus:outline-none"
                  required
                />
                <div className="absolute right-4 top-3.5 text-gray-400">
                  <Scale className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-right md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                أنواع الموازين <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="scalesTypes"
                  placeholder="مثال: ميزان طبلية إلكتروني، ميزان عبور بسكول 60 طن"
                  value={formData.scalesTypes}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gov-primary focus:bg-white focus:ring-2 focus:ring-gov-primary/10 transition-all text-right font-medium text-gov-dark focus:outline-none"
                  required
                />
                <div className="absolute right-4 top-3.5 text-gray-400">
                  <Info className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-right">
            <label className="text-sm font-semibold text-gray-700">ملاحظات إضافية للمكتب</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="أي تفاصيل أو متطلبات خاصة ترغب بذكرها..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gov-primary focus:bg-white focus:ring-2 focus:ring-gov-primary/10 transition-all text-right font-medium text-gov-dark focus:outline-none"
            />
          </div>
        </div>

        {/* Card 3: Attachments */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gov-primary border-r-4 border-gov-gold pr-3 leading-none mb-2">
            المستندات والمرفقات الرسمية المطلوبة
          </h3>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            يرجى رفع المستندات الموقعة والمختومة كأوراق رسمية لتسهيل المراجعة الإدارية.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderFileUpload('طلب الدمغ والمعايرة الرسمي للشركة', 'requestFile')}
            {renderFileUpload('طلب تفويض المندوب المعتمد', 'authorizationFile')}
            {renderFileUpload('صورة سارية للسجل التجاري', 'commercialRegisterFile')}
            {renderFileUpload('صورة البطاقة الضريبية للمنشأة', 'taxCardFile')}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-10 py-4 bg-gov-primary hover:bg-gov-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg focus:outline-none"
          >
            {isLoading ? 'جاري إرسال الطلب والمستندات...' : 'إرسال طلب المعايرة والدمغ'}
          </button>
        </div>

      </form>
    </div>
  );
}
