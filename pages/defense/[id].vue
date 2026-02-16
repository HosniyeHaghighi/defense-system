<template>
  <div class="min-h-screen bg-[#FDFDFD] pb-32">
    <!-- نوار وضعیت بالای صفحه -->
    <div class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4">
      <div class="max-w-2xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            {{ currentProf?.role.charAt(0) }}
          </div>
          <div>
            <h2 class="text-sm font-black text-gray-800">{{ currentProf?.name }}</h2>
            <p class="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">{{ currentProf?.role }}</p>
          </div>
        </div>
        <div class="text-left">
          <p class="text-[10px] text-gray-400 font-bold mb-1 uppercase">زمان سپری شده</p>
          <div class="font-mono text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 italic">
            01:14:22
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto p-6">
      <!-- اطلاعات دانشجو -->
      <header class="mb-10 text-center">
        <span class="bg-blue-50 text-blue-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase mb-4 inline-block">جلسه ارزیابی پایان‌نامه</span>
        <h1 class="text-2xl font-black text-gray-900 leading-tight">
          {{ store.studentInfo.thesisTitle }}
        </h1>
        <p class="text-sm text-gray-500 mt-3 font-medium">دانشجو: <span class="text-gray-800 font-bold">{{ store.studentInfo.name }}</span> | شماره دانشجویی: {{ store.studentInfo.id }}</p>
      </header>

      <!-- فیلدهای نمره‌دهی -->
      <div class="space-y-5">
        <GradeInput title="۱. نحوه ارائه شفاهی و کیفیت دفاع" :maxScore="2" v-model="localGrades.q1" />
        <GradeInput title="۲. چگونگی پاسخگویی به سوالات" :maxScore="2" v-model="localGrades.q2" />
        <GradeInput title="۳. رعایت اصول نگارش، تدوین و کیفیت شکل‌ها" :maxScore="3" v-model="localGrades.q3" />

        <!-- منطق نمره مقاله (بند ۴) -->
        <div class="bg-blue-50/50 p-6 rounded-[2rem] border-2 border-dashed border-blue-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
              <input type="checkbox" v-model="store.hasPaper" class="accent-blue-600" id="paper-check" />
            </div>
            <label for="paper-check" class="text-sm font-black text-blue-900 cursor-pointer">دانشجو دارای دست‌آورد پژوهشی (مقاله) است؟</label>
          </div>
          <div v-if="store.hasPaper">
             <GradeInput title="۴. سایر موارد پژوهشی (مقاله)" :maxScore="2" v-model="localGrades.q4" />
          </div>
          <p v-else class="text-[11px] text-blue-600/70 italic leading-relaxed">
            * در صورت عدم ارائه مقاله در روز دفاع، ۲ نمره این بخش معلق مانده و دانشجو ۶ ماه فرصت ارائه خواهد داشت.
          </p>
        </div>

        <GradeInput title="۵. بدیع بودن و نوآوری پایان‌نامه" :maxScore="2" v-model="localGrades.q5" />
        <GradeInput title="۶. تناسب روش تحقیق با موضوع" :maxScore="2" v-model="localGrades.q6" />
        <GradeInput title="۷. کیفیت تجزیه و تحلیل و انسجام مطالب" :maxScore="4" v-model="localGrades.q7" />
        <GradeInput title="۸. اهمیت نتایج پژوهش" :maxScore="3" v-model="localGrades.q8" />
      </div>

      <!-- سناریوی اصلاحات -->
      <div class="mt-12 p-6 bg-rose-50 rounded-[2rem] border-2 border-rose-100 group transition-all hover:bg-rose-100">
        <div class="flex items-start gap-4">
          <input type="checkbox" v-model="store.needsRevision" id="rev-check" class="mt-1 w-6 h-6 accent-rose-600" />
          <div>
            <label for="rev-check" class="font-black text-rose-900 text-sm cursor-pointer">نیاز به اصلاحات (Minor/Major Revision)</label>
            <p class="text-[11px] text-rose-700/70 mt-1 leading-relaxed">
              با انتخاب این گزینه، نمره در کارنامه ثبت نمی‌شود تا زمانی که شما در همین سامانه دکمه «تایید اصلاحات» را بزنید.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- فوتر هوشمند -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-6 z-[60]">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div>
          <span class="text-[10px] font-black text-gray-400 uppercase block mb-1">مجموع نمره شما:</span>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-black text-blue-600">{{ currentProfessorTotal }}</span>
            <span class="text-gray-300 font-bold">/ ۲۰</span>
          </div>
        </div>
        <button 
          @click="openOtp"
          class="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-gray-200 hover:bg-blue-600 transition-all flex items-center gap-3"
        >
          امضا و ثبت نهایی
          <ChevronLeftIcon class="w-5 h-5 opacity-50" />
        </button>
      </div>
    </footer>

    <!-- OTP Modal -->
    <div v-if="showOtp" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-md rounded-[3rem] p-10 text-center animate-in zoom-in duration-300">
        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheckIcon class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-black text-gray-800">تایید امضای الکترونیک</h3>
        <p class="text-sm text-gray-400 mt-2">کد تایید ۴ رقمی برای شما پیامک شد.</p>
        
        <input type="text" maxlength="4" class="w-full mt-8 text-center text-5xl font-mono tracking-[1rem] p-4 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-blue-500 outline-none" placeholder="0000" />
        
        <div class="grid grid-cols-2 gap-4 mt-10">
          <button @click="showOtp = false" class="py-4 font-bold text-gray-400">انصراف</button>
          <button @click="confirmGrade" class="py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100">ثبت قطعی</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { useDefenseStore } from '~/stores/defense';
import { GraduationCapIcon, InfoIcon, ShieldCheckIcon, ChevronLeftIcon } from 'lucide-vue-next';

const route = useRoute();
const store = useDefenseStore();
const showOtp = ref(false);

// شناسایی استاد لاگین شده بر اساس ID در URL
const profId = parseInt(route.params.id);
const currentProf = computed(() => store.professors.find(p => p.id === profId));

// نمرات محلی برای صفحه
const localGrades = reactive({ ...currentProf.value?.individualGrades });

// مجموع نمره این استاد خاص
const currentProfessorTotal = computed(() => {
  const sum = Object.values(localGrades).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  return sum.toFixed(2);
});

const openOtp = () => {
  if (currentProfessorTotal.value == 0) return alert("لطفاً ابتدا نمرات را وارد کنید.");
  showOtp.value = true;
};

const confirmGrade = () => {
  store.submitProfessorGrade(profId, localGrades);
  showOtp.value = false;
  alert("نمره شما با موفقیت ثبت و امضا شد.");
  navigateTo('/representative/dashboard'); // در دمو به داشبورد می‌رود
};
</script>

<style>
/* استایل برای مخفی کردن فلش‌های input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>