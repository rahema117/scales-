import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, HelpCircle, ArrowRightLeft, FileSpreadsheet, MapPin, Phone, Mail, Award, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    { title: 'دمغ ومعايرة الموازين التجارية', desc: 'معايرة وإصدار أختام الدمغ الرسمية لكافة أنواع الموازين التجارية لضمان البيع العادل.', icon: ShieldCheck },
    { title: 'معايرة موازين البسكول والعبور', desc: 'التحقق الدوري من موازين الشاحنات والعبور الكبيرة في المصانع والمنشآت التجارية.', icon: FileSpreadsheet },
    { title: 'معايرة الأوزان والمقاييس الصناعية', desc: 'معايرة الأوزان القياسية وموازين المختبرات الدقيقة لمطابقة المواصفات القياسية المصرية.', icon: Award },
  ];

  const docs = [
    { title: 'طلب الدمغ والمعايرة الرسمي', desc: 'موقع ومختوم بختم الشركة وموجه لمدير مكتب تفتيش موازين العبور.' },
    { title: 'طلب تفويض المندوب', desc: 'تفويض رسمي باسم المندوب المكلف بإنهاء الإجراءات متضمناً صورة هويته.' },
    { title: 'صورة السجل التجاري', desc: 'يجب أن يكون سارياً ومسجلاً به نشاط الشركة بوضوح.' },
    { title: 'صورة البطاقة الضريبية', desc: 'صورة ضوئية واضحة للبطاقة الضريبية الخاصة بالشركة.' },
  ];

  const steps = [
    { step: '١', title: 'تقديم الطلب إلكترونياً', desc: 'تعبئة بيانات الشركة ورفع المستندات المطلوبة عبر نموذج تقديم الطلب.' },
    { step: '٢', title: 'المراجعة والتدقيق', desc: 'يقوم موظفو التفتيش بمراجعة طلبكم والتحقق من سلامة المستندات المرفقة.' },
    { step: '٣', title: 'تحديد موعد المعايرة', desc: 'سيتم تحديد موعد لزيارة المفتش لموقع الموازين وإشعاركم بالموعد وتكلفته.' },
    { step: '٤', title: 'إتمام الدمغ والختم', desc: 'بعد الفحص الفني والتحقق الفعلي، يتم دمغ الموازين الصالحة وإصدار شهادة المعايرة.' },
  ];

  const faqs = [
    { q: 'ما هي المدة القانونية لصلاحية دمغ الموازين؟', a: 'تعتبر شهادة الدمغ والمعايرة صالحة لمدة عام كامل (سنة واحدة) من تاريخ تنفيذ المعايرة، وتلتزم الشركة بطلب التجديد قبل انتهاء المدة.' },
    { q: 'ماذا يحدث في حال فوات موعد التجديد السنوي؟', a: 'يتم إشعار الشركة بفوات الموعد، وتتحول حالة الشركة تلقائياً في النظام إلى "متأخرة عن التجديد" مما يعرضها لتطبيق الغرامات القانونية في حال استمرار استخدام الموازين غير المدموغة.' },
    { q: 'ما هي أنواع الملفات المسموح بتحميلها في نموذج الطلب؟', a: 'النظام يدعم تحميل المستندات بصيغ PDF والصور (JPG, PNG) بحجم أقصى 5 ميجابايت للملف الواحد.' },
    { q: 'كيف يمكنني الاستعلام عن حالة طلب المعايرة الخاص بي؟', a: 'من خلال صفحة "الاستعلام عن طلب"، يمكنك البحث باستخدام رقم الطلب (مثل REQ-2026-0001) ورقم السجل التجاري للشركة للاطلاع على التفاصيل ومواعيد الزيارة.' }
  ];

  return (
    <div className="flex flex-col gap-16 pb-20 gov-watermark">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gov-dark to-gov-primary text-white py-24 px-4 sm:px-6 lg:px-8 border-b-8 border-gov-gold shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gov-secondary/35 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-gov-gold text-sm font-semibold mb-6 animate-pulse">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>البوابة الإلكترونية الرسمية لمدينة العبور</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            مكتب تفتيش موازين العبور
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            خدمات المعايرة الفنية والدمغ الإلكتروني لموازين البيع والموازين الصناعية والعبور بسكول للشركات والمؤسسات العاملة بمدينة العبور.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4.5">
            <Link
              to="/new-request"
              className="w-full sm:w-auto px-8 py-4 bg-gov-gold hover:bg-gov-gold/90 text-gov-dark text-lg font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-gov-gold/25 focus:outline-none"
            >
              تقديم طلب جديد
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-bold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none"
            >
              الاستعلام عن طلب
            </Link>
          </div>
        </div>
      </section>

      {/* Main Sections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* Section: About (نبذة عن المكتب) */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="flex items-center gap-2 text-gov-primary font-bold text-sm tracking-widest uppercase">
              <span className="h-1 w-8 bg-gov-gold rounded"></span>
              <span>تنظيم القياس والمعايرة</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gov-dark leading-tight">
              نبذة عن مكتب موازين العبور
            </h2>
            <p className="text-gray-600 text-base leading-relaxed font-light">
              تأسس مكتب تفتيش موازين العبور ليكون الجهة الفنية المسؤولة عن مراقبة وضبط أجهزة القياس والوزن بمدينة العبور. نسعى من خلال كوادرنا المتخصصة إلى تطبيق المعايير والمواصفات القياسية المصرية على كافة موازين المحلات التجارية، والمصانع، وموازين البسكول المخصصة للشاحنات.
            </p>
            <p className="text-gray-600 text-base leading-relaxed font-light">
              يساهم المكتب في حماية المستهلك المصري وضمان استقرار المعاملات التجارية والصناعية، وتسهيل إجراءات تقديم طلبات المعايرة للشركات من خلال إتاحة منصتنا الرقمية الجديدة لتقليص الأوقات وتفادي الغرامات.
            </p>
          </div>
          <div className="lg:col-span-5 bg-gradient-to-tr from-gov-light to-white p-8 rounded-3xl border border-gov-primary/10 shadow-md flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gov-gold/10 rounded-bl-full pointer-events-none"></div>
            <div className="flex gap-4 items-start text-right">
              <div className="bg-gov-primary/10 p-3 rounded-2xl text-gov-primary shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gov-dark text-lg mb-1">الاعتماد والترخيص الرسمي</h4>
                <p className="text-sm text-gray-500">مكتب معتمد رسميًا من وزارة التموين ومصلحة الدمغ والموازين المصرية.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start text-right">
              <div className="bg-gov-primary/10 p-3 rounded-2xl text-gov-primary shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gov-dark text-lg mb-1">الرقابة وحماية التجارة</h4>
                <p className="text-sm text-gray-500">حملات تفتيش مستمرة للموازين للتأكد من نزاهة عمليات التعبئة والوزن.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Services (الخدمات المقدمة) */}
        <section id="services" className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-gov-dark">الخدمات التي نقدمها</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light">نقدم مجموعة متكاملة من خدمات المعايرة والدمغ الفني والتفتيش على الموازين</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gov-primary/25 transition-all duration-300 text-right flex flex-col gap-4">
                  <div className="bg-gov-light text-gov-primary w-12 h-12 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gov-dark">{service.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-light">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Required Documents & Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-8">
          
          {/* Docs Checklist (المستندات المطلوبة) */}
          <section id="documents" className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gov-dark text-right">المستندات المطلوبة لتقديم الطلب</h2>
            <p className="text-gray-500 text-right font-light mb-6">يرجى تجهيز المستندات التالية بصيغة ملفات PDF أو صور واضحة قبل البدء:</p>
            <div className="space-y-4">
              {docs.map((doc, index) => (
                <div key={index} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-150 shadow-2xs items-start text-right">
                  <div className="bg-gov-gold/15 text-gov-dark font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-gov-dark text-base">{doc.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-normal">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submission Steps (خطوات تقديم الطلب) */}
          <section id="steps" className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gov-dark text-right">خطوات التقديم والمعايرة</h2>
            <p className="text-gray-500 text-right font-light mb-6">مسار رحلتكم الرقمية من تقديم الطلب حتى إتمام الدمغ الفني بنجاح:</p>
            <div className="relative border-r-2 border-gov-gold/30 mr-4 space-y-8 pr-6 text-right">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step bubble */}
                  <span className="absolute -right-[35px] top-0.5 bg-gov-primary text-gov-gold font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs ring-4 ring-[#f8faf9]">
                    {step.step}
                  </span>
                  <div>
                    <h4 className="font-bold text-gov-dark text-base">{step.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Section: FAQ (الأسئلة الشائعة) */}
        <section id="faq" className="space-y-8 pt-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-gov-dark">الأسئلة الشائعة</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light">إجابات عن الاستفسارات الأكثر تكراراً من الشركات والمستثمرين بمدينة العبور</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4.5 text-right font-bold text-gov-dark hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gov-gold" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-right text-gray-500 border-t border-gray-50 text-sm leading-relaxed font-light animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Quick Contact Box */}
        <section className="bg-gradient-to-l from-gov-primary to-gov-dark text-white rounded-3xl p-10 shadow-lg text-center relative overflow-hidden border-b-4 border-gov-gold">
          <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay"></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold">هل لديك استفسار فني أو شكوى؟</h3>
            <p className="max-w-2xl mx-auto text-gray-200 font-light leading-relaxed">
              يسعدنا الإجابة عن استفساراتكم عبر نموذج المراسلات الفنية، أو من خلال تشريفنا بزيارة مكتب التفتيش بمدينة العبور في ساعات العمل الرسمية.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-3 bg-gov-gold hover:bg-gov-gold/90 text-gov-dark font-bold rounded-lg shadow-md transition-all focus:outline-none"
              >
                تواصل معنا الآن
              </Link>
              <div className="text-xs text-gray-300">
                أو اتصل بنا مباشرة على الهاتف: <span className="font-semibold text-white">02-44789123</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
