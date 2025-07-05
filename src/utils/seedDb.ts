import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { defaultAvailability } from './constants';
import { auth, db } from '@/firebase/firebase';

const users = [
  { email: 'user@gmail.com', password: '123456', role: 'user' },
  { email: 'cgumucio93@gmail.com', password: '123456', role: 'prestador' },
  { email: 'fcodurney@gmail.com', password: '123456', role: 'admin' },
];

export const seedDb = users.forEach((u) => {
  createUserWithEmailAndPassword(auth, u.email, u.password).then((userCredential) => {
    const userId = userCredential.user.uid;
    if (u.role === 'user') {
      const newUser = {
        dob: '',
        phone: '',
        gender: '',
        address: '',
        email: u.email,
        id: userId,
        role: 'user',
        firstname: 'Ignacio',
        lastname: 'Labbe',
        forWhom: 'paciente',
        patientName: 'Joaquin',
        rut: '18445810-1',
        comuna: {
          id: '21',
          name: 'Providencia',
          region: 'Región Metropolitana de Santiago',
          country: 'Chile',
        },
      };
      const userRef = doc(db, 'users', userId);
      return setDoc(userRef, newUser);
    } else if (u.role === 'prestador') {
      const newPrestador = {
        email: u.email,
        id: userId,
        role: 'prestador',
        firstname: 'Carlos',
        lastname: 'Gumucio',
        rut: '18445810-1',
        comunas: [
          {
            id: 21,
            name: 'Providencia',
            region: 'Región Metropolitana de Santiago',
            country: 'Chile',
          },
        ],
        servicio: 'Soporte Terapéutico',
        averageReviews: 0,
        totalReviews: 0,
        description: '',
        offersFreeMeetAndGreet: false,
        createdAt: new Date().toDateString,
        verified: false,
        settings: {
          servicios: false,
          detallesBasicos: false,
          disponibilidad: false,
          comunas: true,
          experiencia: false,
          cuentaBancaria: false,
          historialLaboral: false,
          educacionFormacion: false,
          registroSuperIntendenciaSalud: false,
          insignias: false,
          inmunizacion: false,
          idiomas: false,
          antecedentesCulturales: false,
          religion: false,
          interesesHobbies: false,
          sobreMi: false,
          misPreferencias: false,
        },
      };
      const providerRef = doc(db, 'providers', userId);
      return setDoc(providerRef, newPrestador).then(() => {
        const batch = writeBatch(db);

        defaultAvailability.forEach((day) => {
          const dayRef = doc(providerRef, 'availability', day.day);
          batch.set(dayRef, day);
        });

        return batch
          .commit()
          .then(() => console.log('prestador creado', newPrestador.email, u.password));
      });
    } else {
      const adminRef = doc(db, 'admins', userId);
      return setDoc(adminRef, {
        email: u.email,
        id: userId,
        role: 'admin',
      });
    }
  });
});
