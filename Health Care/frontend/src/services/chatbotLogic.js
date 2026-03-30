export const generateBotResponse = (message) => {
    const text = message.toLowerCase();
    
    // Fetch user profile from localStorage
    const profile = {
        fullName: localStorage.getItem('fullName') || 'there',
        height: localStorage.getItem('height'),
        weight: localStorage.getItem('weight'),
        bloodGlucose: localStorage.getItem('bloodGlucose'),
        bloodPressure: localStorage.getItem('bloodPressure'),
        heartRate: localStorage.getItem('heartRate'),
        fitnessGoal: localStorage.getItem('fitnessGoal') || 'Maintenance',
        activityLevel: localStorage.getItem('activityLevel') || 'Lightly Active'
    };
    
    if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("start")) {
        return `Hello ${profile.fullName}! I'm your WellNest Health Assistant. You can ask me for a 'profile summary', a 'diet plan', or a 'workout routine'. How can I assist you?`;
    }

    if (text.includes("profile") || text.includes("summary")) {
        let response = `Here is your profile summary: `;
        if (profile.weight && profile.weight !== 'null' && profile.height && profile.height !== 'null') {
            const bmi = (parseFloat(profile.weight) / ((parseFloat(profile.height)/100)**2)).toFixed(1);
            response += `You currently weigh ${profile.weight}kg, bringing your BMI to ${bmi}. `;
        }
        if (profile.fitnessGoal && profile.fitnessGoal !== 'null') {
            response += `Your primary fitness goal is "${profile.fitnessGoal}" and your activity level is marked as "${profile.activityLevel}". `;
        } else {
            response += "Make sure to complete your profile setup so I can give you better insights! ";
        }
        return response + "You're doing great keeping your profile updated!";
    }

    if (text.includes("diet") || text.includes("food") || text.includes("eat") || text.includes("meal")) {
        const goal = profile.fitnessGoal;
        if (goal === "Weight Loss") {
            return "Since your goal is weight loss, I recommend a high-protein, caloric deficit diet. Focus on lean meats (chicken, fish), plenty of vegetables, and avoid refined sugars. Aim for at least 2.5 liters of water daily!";
        } else if (goal === "Muscle Gain") {
            return "To build muscle effectively, you need a caloric surplus! Make sure you are eating complex carbs (oats, brown rice), healthy fats, and high-protein foods like Greek yogurt, eggs, and lean meats.";
        } else {
            return "A balanced diet is key for a healthy lifestyle! Ensure you're eating a variety of fruits, vegetables, whole grains, and lean proteins to maintain steady energy levels throughout the day.";
        }
    }

    if (text.includes("workout") || text.includes("exercise") || text.includes("train") || text.includes("gym") || text.includes("fitness")) {
        const level = profile.activityLevel;
        if (level === "Sedentary" || level === "Lightly Active") {
            return "Since you're starting out, try 20-30 minutes of brisk walking or light yoga 3 times a week. Consistency is more important than intensity right now. Don't push too hard too early!";
        } else if (level === "Moderately Active") {
            return "For moderate activity, a mix of cardio and strength training is perfect. Try 3 days of resistance training and 2 days of cardio (like jogging, swimming, or cycling) per week.";
        } else {
            return "You're very active! Keep pushing your limits with high-intensity interval training (HIIT) and heavy resistance training. Also, make sure you're taking 1-2 rest days and focusing on mobility for muscle recovery.";
        }
    }

    if (text.includes("vitals") || text.includes("health") || text.includes("heart") || text.includes("blood") || text.includes("pressure")) {
        const bg = profile.bloodGlucose !== 'null' ? profile.bloodGlucose : '--';
        const bp = profile.bloodPressure !== 'null' ? profile.bloodPressure : '--';
        const hr = profile.heartRate !== 'null' ? profile.heartRate : '--';
        
        return `Your latest recorded vitals are:\n• Blood Glucose: ${bg} mg/dL\n• Blood Pressure: ${bp} mmHg\n• Heart Rate: ${hr} bpm\n\nIf these look outdated, remember to update them in your profile!`;
    }

    return "I am a simple health assistant! Could you try asking me about your 'profile', 'diet', 'workout', or 'vitals'?";
};
