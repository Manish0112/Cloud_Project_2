
const mongoose=require('mongoose');


const PrescriptionSchema=new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    },
    doctorAddress: {
        type: String,
        required: true
    },
    prescriptionType: {
        type: String,
        required: true
    },
    prescriptionName: {
        type: String,
        required: true
    },
    prescriptionInstruction: {
        type: String,
        required: true
    },
    morningDosage: {
        type: String,
        required: true
    },
    middayDosage: {
        type: String,
        required: true
    },
    middayDosage: {
        type: String,
        required: true
    },
    eveningDosage: {
        type: String,
        required: true
    },
    bedtimeDosage: {
        type: String,
        required: true
    }
});


const prescriptions=mongoose.model('prescriptions', PrescriptionSchema);


module.exports = prescriptions;
