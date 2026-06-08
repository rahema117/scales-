import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, Clock, MessageSquare, ShieldAlert, CheckCircle2, FileSearch, HelpCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function TrackRequest() {
  const [requestNumber, setRequestNumber] = useState('');
  const [commercialRegister, setCommercialRegister] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSearchResult(null);

    if (!requestNumber || !commercialRegister) {
      setErrorMsg('يرجى إدخال رقم الطلب ورقم السجل التجاري للتتبع');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/requests/track`, {
        params: {
          requestNumber: requestNumber.trim(),
          commercialRegister: commercialRegister.trim()
        }
      });

      if (response.data.success) {
        setSearchResult(response.data.data);
      } else {
        setErrorMsg('لم يتم العثور على أي نتائج تطابق البيانات المدخلة');
      }
    } catch (err) {
      console.error('Tracking query error:', err);
      setErrorMsg(
        err.response?.data?.message || 
        'لم يتم العثور على طلب مطابق أو حدث خطأ في الاتصال بالخادم.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Determine timeline progress based on current status
  const getStatusStep = (status) => {
    switch (status) {
      case 'تم استلام الطلب': return 1;
      case 'قيد المراجعة': return 2;
      case 'مستندات ناقصة': return 2; // stops here with warnings
      case 'تم تحديد موعد': return 3;
      case 'تم تنفيذ الدمغ والمعايرة': return 4;
      case 'مرفوض': return 0;
      default: return 1;
    }
  };

  const steps = [
    { num: 1, label: 'استلام الطلب' },
    { num: 2, label: 'مراجعة المستندات' },
    { num: 3, label: 'تحديد الزيارة' },
    { num: 4, label: 'إتمام الدمغ' }
  ];

  const currentStep = searchResult ? getStatusStep(searchResult.status) : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-right">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex p-3 bg-gov-light rounded-2xl text-gov-primary">
          <FileSearch className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gov-dark">الاستعلام عن حالة الطلب</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-light">
          أدخل رقم الطلب الصادر عند التقديم ورقم السجل التجاري لمنشأتكم لمتابعة حالة المراجعة ومواعيد زيارة المفتشين.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          
          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">رقم الطلب</label>
            <input
              type="text"
              placeholder="مثال: REQ-2026-0001"
              value={requestNumber}
              onChange={(e) => setRequestNumber(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gov-primary focus:bg-white focus:ring-2 focus:ring-gov-primary/10 transition-all text-right font-medium text-gray-800 placeholder-gray-400 focus:outline-none font-mono"
              required
            />
          </div>

          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">رقم السجل التجاري</label>
            <input
              type="text"
              placeholder="سجل المنشأة المرفق بالطلب"
              value={commercialRegister}
              onChange={(e) => setCommercialRegister(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gov-primary focus:bg-white focus:ring-2 focus:ring-gov-primary/10 transition-all text-right font-medium text-gray-800 placeholder-gray-400 focus:outline-none font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 w-full py-3 px-5 bg-gov-primary hover:bg-gov-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50"
          >
            <Search className="w-5 h-5 shrink-0" />
            <span>استعلم</span>
          </button>

        </form>
      </div>

      {errorMsg && (
        <div className="p-4.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex gap-3 items-start animate-shake">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Results Display */}
      {searchResult && (
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-fade-in space-y-8 p-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-5 gap-3">
            <div>
              <h2 className="text-xl font-bold text-gov-dark">{searchResult.companyName}</h2>
              <p className="text-xs text-gray-400 font-mono mt-1">الطلب: {searchResult.requestNumber}</p>
            </div>
            <div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                searchResult.status === 'تم تنفيذ الدمغ والمعايرة' ? 'bg-green-100 text-green-800' :
                searchResult.status === 'تم تحديد موعد' ? 'bg-gov-goldLight text-gov-dark' :
                searchResult.status === 'مستندات ناقصة' ? 'bg-orange-100 text-orange-800' :
                searchResult.status === 'مرفوض' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {searchResult.status}
              </span>
            </div>
          </div>

          {/* Timeline Visual */}
          {searchResult.status !== 'مرفوض' && (
            <div className="py-6">
              <div className="flex items-center justify-between relative max-w-lg mx-auto select-none">
                
                {/* Horizontal line */}
                <div className="absolute left-6 right-6 top-4.5 h-1 bg-gray-200 -z-10 rounded"></div>
                
                {/* Colored fill line */}
                {currentStep > 1 && (
                  <div
                    className="absolute left-6 right-6 top-4.5 h-1 bg-gov-secondary -z-10 rounded transition-all duration-500"
                    style={{
                      width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                      marginRight: 'auto',
                      marginLeft: 0
                    }}
                  ></div>
                )}

                {steps.map((step) => {
                  const isCompleted = step.num < currentStep;
                  const isActive = step.num === currentStep;
                  return (
                    <div key={step.num} className="flex flex-col items-center gap-2.5 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300 ${
                        isCompleted ? 'bg-gov-secondary text-white border-gov-secondary shadow-md' :
                        isActive ? 'bg-white text-gov-gold border-gov-primary ring-4 ring-gov-light shadow-md scale-110' :
                        'bg-white text-gray-400 border-gray-200'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                      </div>
                      <span className={`text-xs font-bold ${isActive ? 'text-gov-primary' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* Details Card */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
            
            {searchResult.status === 'مستندات ناقصة' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex gap-3 text-sm text-orange-900 leading-normal">
                <ShieldAlert className="w-5 h-5 shrink-0 text-orange-600 mt-0.5" />
                <div>
                  <strong>ملاحظة إدارية:</strong> هناك مستندات مرفقة بالطلب تحتاج لمراجعة أو لم ترفع بشكل صحيح. يرجى تزويد المكتب بها يدويًا أو متابعة الإشعار.
                </div>
              </div>
            )}

            {searchResult.status === 'تم تحديد موعد' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-150 flex items-center gap-3.5">
                  <div className="bg-gov-light p-2.5 rounded-lg text-gov-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">تاريخ الزيارة المقررة</span>
                    <span className="font-extrabold text-gov-dark font-mono">{searchResult.appointmentDate}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-150 flex items-center gap-3.5">
                  <div className="bg-gov-light p-2.5 rounded-lg text-gov-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">وقت الزيارة التقريبي</span>
                    <span className="font-extrabold text-gov-dark font-mono">{searchResult.appointmentTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {searchResult.adminNotes && (
              <div className="bg-white p-4.5 rounded-xl border border-gray-150 space-y-2">
                <span className="text-xs text-gray-400 flex items-center gap-1.5 font-bold">
                  <MessageSquare className="w-4 h-4 text-gov-gold" />
                  <span>ملاحظات مفتش موازين العبور:</span>
                </span>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {searchResult.adminNotes}
                </p>
              </div>
            )}

            {/* General Advice */}
            <div className="text-xs text-gray-400 border-t border-gray-200 pt-3 flex gap-2 justify-start leading-normal">
              <span>💡</span>
              <span>في حال وجود أي استفسارات فنية، يمكنكم الاتصال بالدعم الفني وتزويدهم برقم الطلب ({searchResult.requestNumber}).</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
