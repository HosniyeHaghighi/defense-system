<template>
  <div class="relative bg-white p-1 rounded-2xl border transition-all duration-300" 
       :class="[isFocused ? 'border-blue-500 shadow-lg ring-4 ring-blue-50' : 'border-gray-100 shadow-sm']">
    <div class="flex items-center p-3 gap-4">
      <!-- بخش عنوان -->
      <div class="flex-1">
        <h4 class="text-[13px] font-black text-gray-800 leading-tight">{{ title }}</h4>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Max Score: {{ maxScore }}</span>
          <div class="h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 transition-all duration-500" :style="{ width: (modelValue / maxScore) * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- بخش اینپوت -->
      <div class="relative w-24">
        <input 
          type="number" 
          :value="modelValue"
          @input="handleInput"
          @focus="isFocused = true"
          @blur="isFocused = false"
          step="0.25"
          class="w-full text-center py-3 bg-gray-50 rounded-xl font-mono text-lg font-black text-blue-600 outline-none border-2 border-transparent focus:bg-white"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['title', 'maxScore', 'modelValue']);
const emit = defineEmits(['update:modelValue']);
const isFocused = ref(false);

const handleInput = (e) => {
  let val = parseFloat(e.target.value);
  if (val > props.maxScore) val = props.maxScore;
  if (val < 0 || isNaN(val)) val = 0;
  emit('update:modelValue', val);
};
</script>