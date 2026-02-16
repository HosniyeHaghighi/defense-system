import { defineStore } from 'pinia'

export const useDefenseStore = defineStore('defense', {
  state: () => ({
    studentInfo: { 
      name: 'یاسمین جنتی', 
      id: '401550008', 
      thesisTitle: 'تولید و تعیین خصوصیت آنزیم پت هیدرولاز باکتریایی'
    },
    professors: [
      { id: 1, name: 'دکتر دلفارد', role: 'راهنما', isPresent: true, hasGraded: false, individualGrades: createEmptyGrades() },
      { id: 2, name: 'دکتر کرمی', role: 'مشاور', isPresent: true, hasGraded: false, individualGrades: createEmptyGrades() },
      { id: 3, name: 'دکتر روان', role: 'داور اول', isPresent: true, hasGraded: false, individualGrades: createEmptyGrades() },
      { id: 4, name: 'دکتر ساسان', role: 'داور دوم', isPresent: true, hasGraded: false, individualGrades: createEmptyGrades() },
    ],
    hasPaper: false,
    needsRevision: false,
    isFinalized: false
  }),

  getters: {
    calculateLiveScore(state): string {
      const supervisor = state.professors.find(p => p.role === 'راهنما');
      const advisor = state.professors.find(p => p.role === 'مشاور');
      const referees = state.professors.filter(p => p.role.includes('داور') && p.isPresent);

      const getSum = (p: any) => Object.entries(p.individualGrades)
        .filter(([key]) => key !== 'q4') // نمره مقاله را فعلاً جدا می‌کنیم
        .reduce((a, b) => a + (Number(b[1]) || 0), 0);

      let sScore = supervisor?.hasGraded ? getSum(supervisor) : 0;
      let aScore = advisor?.hasGraded ? getSum(advisor) : 0;
      
      let rSum = 0; let rCount = 0;
      referees.forEach(r => { if (r.hasGraded) { rSum += getSum(r); rCount++; } });
      let rAvg = rCount > 0 ? rSum / rCount : 0;

      const weightedSum = (sScore * 2) + (rAvg * 2) + (aScore * 1);
      const divider = advisor ? 5 : 4; 
      
      return (weightedSum / divider).toFixed(2);
    },
    gradedCount: (state) => state.professors.filter(p => p.hasGraded).length
  },

  actions: {
    submitProfessorGrade(profId: number, grades: any) {
      const prof = this.professors.find(p => p.id === profId);
      if (prof) {
        prof.individualGrades = { ...grades };
        prof.hasGraded = true;
      }
    },
    replaceProfessor(oldId: number, newName: string) {
      const prof = this.professors.find(p => p.id === oldId);
      if (prof) { prof.name = newName; prof.hasGraded = false; }
    }
  }
})

function createEmptyGrades() {
  return { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0 };
}