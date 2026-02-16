<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-white">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-blue-600 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
          <GraduationCapIcon class="w-10 h-10 text-white -rotate-12" />
        </div>
        <h1 class="text-2xl font-black text-slate-800">سامانه دفاع هوشمند</h1>
        <p class="text-slate-400 text-sm mt-2 font-medium">دانشگاه شهید باهنر کرمان</p>
      </div>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2 mr-2">شماره موبایل یا کد ملی</label>
          <input 
            type="text" 
            v-model="loginField"
            placeholder="مثلاً ۰۹۱۳۱۲۳۴۵۶۷"
            class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-center tracking-widest font-bold"
          />
        </div>

        <button 
          @click="handleLogin"
          class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          ورود به جلسه دفاع
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="mt-10 pt-6 border-t border-slate-50 text-center">
        <p class="text-[10px] text-slate-400 leading-relaxed italic">
          این لینک بصورت اختصاصی برای اساتید محترم ارسال شده است. <br>
          در صورت بروز مشکل با تحصیلات تکمیلی تماس بگیرید.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GraduationCapIcon, ArrowLeftIcon } from 'lucide-vue-next';
const loginField = ref("");
const handleLogin = () => {
  if(loginField.value) {
    // در دنیای واقعی اینجا توکن چک می‌شود
    navigateTo('/defense/1'); // فعلاً به صفحه داور ۱ می‌رود
  }
};
</script>