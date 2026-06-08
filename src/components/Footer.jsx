import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gov-dark text-gray-300 border-t-4 border-gov-gold relative z-10 no-print select-none">
      
      {/* Main Info Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: Info and Mission */}
          <div className="flex flex-col gap-4 text-right">
            <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">
              مكتب تفتيش موازين العبور
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              جهة حكومية متخصصة تابعة لمصلحة الدمغ والموازين، نعمل على التحقق من دقة وصلاحية كافة موازين العبور وآلات القياس التجارية والصناعية لضمان النزاهة وحماية حقوق المتعاملين.
            </p>
          </div>

          {/* Column 2: Hours & Schedule */}
          <div className="flex flex-col gap-4 text-right">
            <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">
              ساعات العمل الرسمية
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2.5 justify-start">
                <Clock className="w-4 h-4 text-gov-gold shrink-0" />
                <span>الأحد - الخميس: من الساعة 8:30 صباحًا حتى 3:00 مساءً</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span>الجمعة والسبت: عطلة رسمية</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start text-gov-gold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>ملاحظة: تُقبل طلبات المعايرة عبر الموقع على مدار الساعة.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="flex flex-col gap-4 text-right">
            <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">
              بيانات التواصل
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-gov-gold shrink-0" />
                <span>المنطقة الصناعية، مدينة العبور، محافظة القليوبية، مصر</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Phone className="w-4 h-4 text-gov-gold shrink-0" />
                <span>الدعم الفني والشكاوى: 02-44789123 / 02-44789124</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Mail className="w-4 h-4 text-gov-gold shrink-0" />
                <span>البريد الإلكتروني: obour-office@msit.gov.eg</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="bg-black/40 py-5 text-center text-xs text-gray-500 border-t border-white/5 font-light">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>
            جميع الحقوق محفوظة © {currentYear} لـ مصلحة الدمغ والموازين - مكتب تفتيش موازين العبور.
          </span>
          <div className="flex gap-4">
            <Link to="/admin/login" className="hover:text-gov-gold transition-colors">دخول الموظفين</Link>
            <span>•</span>
            <span className="text-gray-600">بوابة الخدمات الآمنة</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
