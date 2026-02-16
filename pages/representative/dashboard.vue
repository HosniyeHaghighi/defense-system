<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- هدر با اطلاعات دانشجو -->
    <nav class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
      <div class="max-w-5xl mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-black text-gray-800 flex items-center gap-2">
            <MonitorIcon class="w-6 h-6 text-blue-600" />
            پنل مدیریت و نظارت تحصیلات تکمیلی
          </h1>
          <p class="text-xs text-gray-500 mt-1">
            جلسه دفاع: <span class="font-bold text-gray-700">{{ store.studentInfo.name }}</span> | رشته {{ store.studentInfo.field }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-sm font-medium text-gray-600">جلسه در جریان است</span>
        </div>
      </div>
    </nav>

    <main class="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- ستون سمت راست: وضعیت داوران -->
      <div class="lg:col-span-2 space-y-6">
        <section class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 class="font-black text-gray-800 flex items-center gap-2">
              <UsersIcon class="w-5 h-5 text-blue-600" />
              وضعیت حضور و فعالیت هیئت داوران
            </h2>
            <span class="text-[10px] font-bold text-gray-400">تعداد اساتید: {{ store.professors.length }} نفر</span>
          </div>

          <div class="divide-y divide-gray-50">
            <div v-for="prof in store.professors" :key="prof.id" class="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold uppercase">
                    {{ prof.name.split(" ")[1]?.charAt(0) || "د" }}
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white" :class="prof.isPresent ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800">{{ prof.name }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold tracking-tighter">{{ prof.role }}</span>
                    <span v-if="prof.hasGraded" class="text-[10px] px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-bold italic flex items-center gap-1">
                       <CheckIcon class="w-3 h-3" /> نمره ثبت شد ({{ store.getProfessorTotal(prof.id) }})
                    </span>
                    <span v-else class="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 font-bold">در انتظار نمره</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <!-- دکمه تست: ورود به جای استاد -->
                <NuxtLink :to="`/defense/${prof.id}`" class="p-2 text-blue-400 hover:bg-blue-50 rounded-xl transition-all" title="ورود به فرم نمره‌دهی این استاد">
                  <LogInIcon class="w-5 h-5" />
                </NuxtLink>

                <button v-if="prof.isPresent" @click="toggleAttendance(prof)" class="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all" title="اعلام غیبت">
                  <UserXIcon class="w-5 h-5" />
                </button>
                <button v-else @click="triggerSubstitution(prof)" class="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition-all">
                  <UserPlusIcon class="w-4 h-4" /> جایگزین
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- بخش تاریخچه تغییرات (Audit Log) -->
        <section class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-black text-gray-800 flex items-center gap-2">
              <HistoryIcon class="w-5 h-5 text-gray-400" />
              تاریخچه وقایع جلسه (Audit Log)
            </h3>
          </div>
          <div class="bg-gray-50 rounded-2xl p-4 h-48 overflow-y-auto border border-gray-100 space-y-3">
            <div v-for="(log, index) in store.logs" :key="index" class="flex gap-3 text-[11px] font-mono animate-in slide-in-from-right duration-300">
              <span class="text-gray-400 shrink-0">{{ log.time }}</span>
              <span class="font-bold shrink-0 text-blue-600">{{ log.actor }}:</span>
              <span class="text-gray-600 leading-relaxed">{{ log.message }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- ستون سمت چپ: محاسبات نمره -->
      <div class="space-y-6">
        <section class="bg-blue-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 sticky top-24">
          <h2 class="text-lg font-black mb-6 border-b border-blue-800 pb-4">خلاصه وضعیت نمره نهایی</h2>

          <div class="space-y-4 mb-8">
            <div class="flex justify-between items-center text-sm">
              <span class="text-blue-300">اساتید نمره دهنده:</span>
              <span class="font-bold">{{ store.gradedCount }} از {{ store.professors.length }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-blue-300">وضعیت اصلاحات:</span>
              <span v-if="store.needsRevision" class="text-orange-400 font-bold flex items-center gap-1">
                <AlertCircleIcon class="w-4 h-4" /> نمره قفل (اصلاحات)
              </span>
              <span v-else class="text-green-400 font-bold">بدون اصلاحات</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-blue-300 text-xs">نمره مقاله (بند ۴):</span>
              <span v-if="store.hasPaper" class="text-green-400 font-bold">ارائه شده</span>
              <span v-else class="text-gray-400 font-bold italic">معلق</span>
            </div>
          </div>

          <div class="bg-blue-800/50 rounded-2xl p-6 text-center border border-blue-700/50 mb-6">
            <span class="text-[10px] text-blue-300 font-bold uppercase block mb-1">میانگین کل (باهنر کرمان):</span>
            <div class="text-6xl font-black mb-2 tabular-nums tracking-tighter">
              {{ store.finalCalculatedScore }}
            </div>
            <div class="flex justify-center gap-2 mt-4 flex-wrap">
              <div class="bg-blue-900/50 px-2 py-1 rounded text-[9px] text-blue-200">راهنما (×۲)</div>
              <div class="bg-blue-900/50 px-2 py-1 rounded text-[9px] text-blue-200">داوران (×۲)</div>
              <div class="bg-blue-900/50 px-2 py-1 rounded text-[9px] text-blue-200">مشاور (×۱)</div>
            </div>
          </div>

          <button
            @click="handleFinalize"
            :disabled="store.gradedCount < store.professors.length"
            class="w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg"
            :class="store.gradedCount === store.professors.length ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-blue-800 text-blue-400 cursor-not-allowed'"
          >
            <CheckCircleIcon class="w-5 h-5" />
            تایید نهایی و ختم جلسه
          </button>
        </section>

        <!-- یادآوری امنیتی -->
        <div class="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
          <h4 class="text-xs font-bold text-orange-800 flex items-center gap-1 mb-1">
            <ShieldCheckIcon class="w-3 h-3" /> یادآوری سیستم:
          </h4>
          <p class="text-[10px] text-orange-700 leading-relaxed">
             پس از تایید نهایی، نمره در کارنامه گلستان ثبت شده و دسترسی اساتید به فرم‌ها مسدود می‌گردد.
          </p>
        </div>
      </div>
    </main>

    <!-- مودال جایگزینی -->
    <div v-if="isReplaceModalOpen" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <h3 class="text-xl font-black text-gray-800 mb-2">داور جایگزین آنی</h3>
        <p class="text-xs text-gray-500 mb-6">در صورت غیبت استاد، داور جایگزین را از لیست زیر انتخاب کنید:</p>

        <select v-model="selectedNewProf" class="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 mb-6 font-bold">
          <option value="">انتخاب از لیست اساتید...</option>
          <option value="دکتر محمدی">دکتر محمدی (گروه بیوشیمی)</option>
          <option value="دکتر علوی">دکتر علوی (گروه زیست‌شناسی)</option>
        </select>

        <div class="flex gap-3">
          <button @click="isReplaceModalOpen = false" class="flex-1 py-3 text-gray-400 font-bold">انصراف</button>
          <button @click="confirmSubstitution" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-100">ارسال لینک جدید</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useDefenseStore } from "~/stores/defense";
  import { 
    UsersIcon, MonitorIcon, UserXIcon, UserPlusIcon, HistoryIcon, 
    CheckCircleIcon, ShieldCheckIcon, LogInIcon, CheckIcon, AlertCircleIcon 
  } from "lucide-vue-next";

  const store = useDefenseStore();

  // وضعیت‌های لوکال
  const isReplaceModalOpen = ref(false);
  const selectedNewProf = ref("");
  const targetProfForReplace = ref(null);

  // عملیات حضور و غیبت
  const toggleAttendance = (prof) => {
    prof.isPresent = !prof.isPresent;
    const status = prof.isPresent ? "حاضر" : "غایب";
    store.addLog("نماینده", `وضعیت حضور ${prof.name} به (${status}) تغییر یافت.`);
  };

  const triggerSubstitution = (prof) => {
    targetProfForReplace.value = prof;
    isReplaceModalOpen.value = true;
  };

  const confirmSubstitution = () => {
    if (!selectedNewProf.value) return;
    const oldName = targetProfForReplace.value.name;
    store.replaceProfessor(targetProfForReplace.value.id, selectedNewProf.value);
    isReplaceModalOpen.value = false;
    selectedNewProf.value = "";
  };

  const handleFinalize = () => {
    if (store.needsRevision) {
       alert("پایان‌نامه دارای اصلاحات است. نمره در حالت معلق (Pending) ثبت خواهد شد.");
    }
    
    if (confirm("آیا از صحت نمرات و امضای تمامی اساتید اطمینان دارید؟ جلسه با موفقیت خاتمه یابد؟")) {
      store.sessionStatus = 'finished';
      store.addLog("سیستم", "جلسه دفاع با موفقیت خاتمه یافت. نمره نهایی به کارنامه ارسال شد.");
      
      // هدایت به صفحه گزارش نهایی (گام بعدی)
      // navigateTo('/representative/report');
    }
  };
</script>

<style scoped>
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>