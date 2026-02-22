<template>
  <div class="min-h-screen bg-gray-200 py-10 px-4 print:p-0 print:bg-white">
    <!-- دکمه‌های عملیاتی (در چاپ مخفی می‌شوند) -->
    <div
      class="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden"
    >
      <NuxtLink
        to="/representative/dashboard"
        class="flex items-center gap-2 text-gray-600 font-bold"
      >
        <ArrowRightIcon class="w-5 h-5" /> بازگشت به داشبورد
      </NuxtLink>
      <button
        @click="generatePDF"
        class="bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
      >
        <DownloadIcon class="w-5 h-5" /> دریافت فایل PDF صورت‌جلسه
      </button>
    </div>

    <!-- بدنه اصلی صورت‌جلسه (شبیه فرم رسمی دانشگاه) -->
    <div
      id="official-report"
      class="max-w-[210mm] mx-auto bg-white shadow-2xl p-12 min-h-[297mm] relative text-gray-900 leading-relaxed overflow-hidden"
    >
      <!-- هدر رسمی -->
      <div
        class="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8"
      >
        <div class="text-xs space-y-2 font-bold">
          <p>تاریخ: {{ currentDate }}</p>
          <p>شماره: {{ reportNumber }}</p>
          <p>پیوست: دارد</p>
        </div>
        <div class="text-center">
          <img
            src="https://uk.ac.ir/images/logo.png"
            alt="Logo"
            class="w-20 mx-auto mb-2 opacity-80"
          />
          <h1 class="text-lg font-black">دانشگاه شهید باهنر کرمان</h1>
          <h2 class="text-sm font-bold">تحصیلات تکمیلی دانشکده علوم</h2>
          <p class="text-xs mt-1 italic">
            صورت‌جلسه نهایی ارزیابی پایان‌نامه کارشناسی ارشد
          </p>
        </div>
        <div
          class="w-24 h-24 border border-gray-200 flex items-center justify-center text-[10px] text-gray-300"
        >
          محل الصاق عکس
        </div>
      </div>

      <!-- اطلاعات دانشجو -->
      <div class="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
        <div class="grid grid-cols-2 gap-y-4 text-sm">
          <p>
            نام و نام خانوادگی دانشجو:
            <strong class="text-gray-900">{{ store.studentInfo.name }}</strong>
          </p>
          <p>
            شماره دانشجویی:
            <strong class="text-gray-900">{{ store.studentInfo.id }}</strong>
          </p>
          <p>
            رشته و گرایش:
            <strong class="text-gray-900">{{ store.studentInfo.field }}</strong>
          </p>
          <p>
            سال ورود:
            <strong class="text-gray-900">{{
              store.studentInfo.entryYear
            }}</strong>
          </p>
          <p class="col-span-2 leading-8">
            عنوان پایان‌نامه:
            <strong class="text-gray-900">{{
              store.studentInfo.thesisTitle
            }}</strong>
          </p>
        </div>
      </div>

      <!-- جدول نمرات نهایی -->
      <table
        class="w-full border-collapse border border-gray-900 text-sm mb-10"
      >
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-900 p-2 text-right">ردیف</th>
            <th class="border border-gray-900 p-2 text-right w-2/3">
              عنوان معیار ارزیابی
            </th>
            <th class="border border-gray-900 p-2 text-center">سقف</th>
            <th class="border border-gray-900 p-2 text-center">
              نمره نهایی (میانگین)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(title, index) in criteriaTitles" :key="index">
            <td class="border border-gray-900 p-2 text-center">
              {{ index + 1 }}
            </td>
            <td class="border border-gray-900 p-2">{{ title }}</td>
            <td class="border border-gray-900 p-2 text-center">
              {{ criteriaMax[index] }}
            </td>
            <td class="border border-gray-900 p-2 text-center font-bold">
              {{ calculateAverageForCriteria(index + 1) }}
            </td>
          </tr>
          <tr class="bg-gray-50 font-black text-lg">
            <td colspan="3" class="border border-gray-900 p-4 text-left">
              میانگین وزنی کل از ۲۰ (بر اساس فرمول مصوب):
            </td>
            <td class="border border-gray-900 p-4 text-center text-blue-800">
              {{ store.finalCalculatedScore }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- وضعیت اصلاحات و مقاله -->
      <div class="grid grid-cols-2 gap-6 mb-12">
        <div class="border-2 border-dotted border-gray-300 p-4 rounded-xl">
          <h4 class="text-xs font-bold mb-2">وضعیت دست‌آورد پژوهشی (مقاله):</h4>
          <p v-if="store.hasPaper" class="text-sm text-green-700 font-bold">
            ✓ نمره مقاله لحاظ شده است.
          </p>
          <p v-else class="text-sm text-orange-600 italic">
            × نمره مقاله معلق می‌باشد (فرصت ۶ ماهه).
          </p>
        </div>
        <div class="border-2 border-dotted border-gray-300 p-4 rounded-xl">
          <h4 class="text-xs font-bold mb-2">وضعیت نهایی اصلاحات:</h4>
          <p v-if="store.needsRevision" class="text-sm text-red-600 font-bold">
            ⚠ تایید نهایی منوط به انجام اصلاحات است.
          </p>
          <p v-else class="text-sm text-green-700 font-bold">
            ✓ بدون نیاز به اصلاحات ثانویه.
          </p>
        </div>
      </div>

      <!-- بخش امضاها -->
      <!-- بخش امضاها (جایگزین بخش قبلی در تمپلیت شود) -->
      <div class="mt-16">
        <h3
          class="text-[13px] font-black mb-8 border-b-2 border-gray-100 pb-2 text-gray-800"
        >
          تاییدیه و امضای الکترونیک هیئت داوران:
        </h3>

        <!-- شبکه امضاها با فاصله عمودی زیاد برای جلوگیری از تداخل -->
        <div class="grid grid-cols-2 gap-x-12 gap-y-20">
          <div
            v-for="prof in store.professors"
            :key="prof.id"
            class="text-center flex flex-col items-center"
          >
            <p
              class="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest"
            >
              {{ prof.role }}
            </p>
            <p class="text-[15px] font-black text-gray-900 mb-3">
              {{ prof.name }}
            </p>

            <!-- باکس امضای دیجیتال با استایل فیکس شده -->
            <div
              class="w-full max-w-[220px] py-4 px-2 border-2 border-dashed border-blue-50 rounded-2xl bg-blue-50/30 flex flex-col items-center justify-center"
            >
              <span class="text-[10px] text-blue-500 font-mono italic font-bold"
                >Digitally Signed By OTP</span
              >
              <span class="text-[9px] text-blue-300 font-mono mt-1"
                >REF:
                {{
                  Math.random().toString(36).substring(7).toUpperCase()
                }}</span
              >
            </div>
            <p class="text-[9px] text-gray-400 mt-2 font-medium italic">
              تاریخ تایید: {{ currentDate }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="mt-24 border-t-2 border-gray-900 pt-8 flex justify-between items-center"
      >
        <div class="max-w-[70%]">
          <p class="text-[11px] text-gray-800 font-bold leading-relaxed">
            این صورت‌جلسه به صورت دیجیتال در سامانه «دفاع هوشمند» دانشگاه شهید
            باهنر کرمان صادر شده و طبق ضوابط تحصیلات تکمیلی، نسخه الکترونیک آن
            معتبر و قابل استعلام می‌باشد.
          </p>
          <div class="flex gap-6 mt-3">
            <p class="text-[10px] text-gray-500 font-mono">
              DOC-ID: {{ reportNumber }}-SEC
            </p>
            <p class="text-[10px] text-gray-500 font-mono">
              VERIFICATION-CODE: 00492-X
            </p>
          </div>
        </div>

        <div class="flex flex-col items-center gap-2">
          <div
            class="w-20 h-20 bg-gray-50 border-2 border-gray-100 rounded-xl flex items-center justify-center p-2"
          >
            <div
              class="w-full h-full bg-slate-200 rounded flex items-center justify-center text-[8px] text-slate-400 text-center font-bold"
            >
              QR-ID VALID
            </div>
          </div>
          <span
            class="text-[9px] font-black text-gray-400 uppercase tracking-tighter"
            >تایید اصالت سند</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useDefenseStore } from "~/stores/defense";
  import { ArrowRightIcon, DownloadIcon } from "lucide-vue-next";
  import jsPDF from "jspdf";
  import html2canvas from "html2canvas";

  const store = useDefenseStore();

  const reportNumber = ref("D-403-882");
  const currentDate = new Intl.DateTimeFormat("fa-IR").format(new Date());

  const criteriaTitles = [
    "نحوه ارائه شفاهی و کیفیت دفاع",
    "چگونگی پاسخگویی به سوالات",
    "رعایت اصول نگارش و تدوین",
    "سایر موارد پژوهشی (مقاله)",
    "بدیع بودن و نوآوری پایان‌نامه",
    "تناسب روش تحقیق با موضوع",
    "کیفیت تجزیه و تحلیل",
    "اهمیت نتایج",
  ];

  const criteriaMax = [2, 2, 3, 2, 2, 2, 4, 3];

  // محاسبه میانگین هر معیار برای جدول
  const calculateAverageForCriteria = (qNumber) => {
    const gradedProfs = store.professors.filter((p) => p.hasGraded);
    if (gradedProfs.length === 0) return "0.00";

    const sum = gradedProfs.reduce(
      (acc, p) => acc + (p.individualGrades[`q${qNumber}`] || 0),
      0,
    );
    return (sum / gradedProfs.length).toFixed(2);
  };

  // تابع اصلی تولید PDF
  const generatePDF = async () => {
    const element = document.getElementById("official-report");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Minutes-Defense-${store.studentInfo.id}.pdf`);
  };
</script>

<style scoped>
  @media print {
    body {
      background: white;
    }
  }

  #official-report {
    font-family: "Vazirmatn", sans-serif;
  }
</style>
