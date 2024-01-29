class Validator {
  constructor(nik) {
    this.nik = nik;
    this.regions = require("./assets/regions.json");
  }

  static set(nik) {
    return new Validator(nik);
  }

  parse() {
    if (!this.isValid()) {
      return {
        valid: false,
      };
    }

    const bornDate = this.getBornDate();

    return {
      nik: this.nik,
      address: this.getAddress(),
      age: this.getAge(),
      borndate: bornDate,
      gender: this.getGender(),
      nextBirthday: this.getNextBirthday(),
      uniqCode: this.nik.slice(12, 16),
      zodiac: zodiac(bornDate.month, bornDate.date),
      valid: true,
    };
  }

  getAddress() {
    const provCode = this.nik.slice(0, 2);
    const regCode = this.nik.slice(0, 4);
    const subCode = this.nik.slice(0, 6);

    return {
      province: this.regions.provinces[provCode] || null,
      regency: this.regions.regencies[regCode] || null,
      subdistrict: this.regions.subdistricts[subCode] || null,
    };
  }

  getAge() {
    const bornDate = this.getBornDate();

    const bornDateObj = new Date(
      `${bornDate.year}-${bornDate.month}-${bornDate.date}`
    );
    const interval = new Date() - bornDateObj;
    const ageDate = new Date(interval);

    return {
      year: ageDate.getUTCFullYear() - 1970,
      month: ageDate.getUTCMonth(),
      day: ageDate.getUTCDate() - 1,
    };
  }

  getBornDate() {
    const bornDate = parseInt(this.nik.slice(6, 8));
    const bornYear = parseInt(this.nik.slice(10, 12));
    const currYear = parseInt(new Date().getFullYear().toString().slice(-2));
    const gender = this.getGender();

    return {
      date: gender === "PEREMPUAN" ? bornDate - 40 : bornDate,
      month: parseInt(this.nik.slice(8, 10)),
      year: bornYear < currYear ? bornYear + 2000 : bornYear + 1900,
    };
  }

  getGender() {
    const bornDate = parseInt(this.nik.slice(6, 8));

    return bornDate > 40 ? "PEREMPUAN" : "LAKI-LAKI";
  }

  getNextBirthday() {
    const bornDate = this.getBornDate();
    const diff =
      Date.parse(`${bornDate.year}-${bornDate.month}-${bornDate.date}`) -
      Date.now();

    const monthDiff = Math.abs(new Date(diff).getUTCMonth());
    const dayDiff = Math.abs(new Date(diff).getUTCDate() - 1);

    return {
      month: monthDiff,
      day: dayDiff,
    };
  }

  isValid() {
    const isValidLen = this.nik.length === 16;
    const address = this.getAddress();

    return (
      isValidLen && address.province && address.regency && address.subdistrict
    );
  }
}

function zodiac(month, date) {
  const zodiacs = [
    { name: "Capricorn", start_date: "12-22", end_date: "01-19" },
    { name: "Aquarius", start_date: "01-20", end_date: "02-18" },
    { name: "Pisces", start_date: "02-19", end_date: "03-20" },
    { name: "Aries", start_date: "03-21", end_date: "04-19" },
    { name: "Taurus", start_date: "04-20", end_date: "05-20" },
    { name: "Gemini", start_date: "05-21", end_date: "06-20" },
    { name: "Cancer", start_date: "06-21", end_date: "07-22" },
    { name: "Leo", start_date: "07-23", end_date: "08-22" },
    { name: "Virgo", start_date: "08-23", end_date: "09-22" },
    { name: "Libra", start_date: "09-23", end_date: "10-22" },
    { name: "Scorpio", start_date: "10-23", end_date: "11-21" },
    { name: "Sagittarius", start_date: "11-22", end_date: "12-21" },
  ];

  const year = new Date().getFullYear() + "-";
  const birthDate = new Date(year + month + "-" + date);

  for (const zodiac of zodiacs) {
    const startDate = new Date(year + zodiac.start_date);
    const endDate = new Date(year + zodiac.end_date);

    if (birthDate >= startDate && birthDate <= endDate) {
      return zodiac.name;
    }
  }

  return "Unknown";
}

module.exports = Validator;
