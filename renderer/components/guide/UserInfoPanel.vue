<template>
    <div class="user-info-panel gap-5 flex flex-col items-center justify-center h-full">
        <div class="flex items-center">
            <iconify-icon icon="material-symbols:person-outline" width="48" height="48" />
            <span class="text-3xl font-bold">考生信息</span>
        </div>

        <div class="flex flex-col gap-5 p-10 rounded-xl shadow-xl text-2xl">
            <div>
                <label for="name">姓名:</label>
                <span>{{ userInfo.name }}</span>
            </div>
            <div>
                <label for="studentId">学号:</label>
                <span>{{ userInfo.studentId }}</span>
            </div>
            <div>
                <label for="subject">考试科目:</label>
                <span>{{ userInfo.subject }}</span>
            </div>
            <div>
                <label for="examMode">考试模式:</label>
                <span>{{ userInfo.examMode }}</span>
            </div>
        </div>

        <div>
            <iconify-icon icon="material-symbols:warning-outline" width="32" height="32" class="inline-block mr-2 text-yellow-500" />
            <span class="text-lg underline">
                请确认以上信息无误，大声喊出
            </span>

            <span class="text-2xl font-bold underline-offset-4 text-red-500">
                "确认"
            </span>
            <span class="text-lg underline">
                进入考试。
            </span>
            
        </div>

    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
defineOptions({
    name: 'UserInfoPanel',
});

const userInfo = reactive({
    name: '张三',
    studentId: '20230001',
    subject: 'CPR考试',
    examMode: '练习' // 或者 '考核'
});


</script>

<style scoped>
.user-info-panel {
    padding: 16px;
    background-color: #f9f9f9;
}

label {
    font-weight: bold;
    margin-right: 8px;
}
</style>