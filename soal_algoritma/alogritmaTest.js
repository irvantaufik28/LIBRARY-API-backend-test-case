
//  1. Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"


const reverseWithouNumber = (str) => {
    let reverseStr = str.replace(/[a-z]+/gi, function(s){return s.split('').reverse().join('')});
    return reverseStr
}

console.log(reverseWithouNumber("NEGIE1"))



// 2. Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat tersebut, jika ada kata dengan panjang yang sama silahkan ambil salah satu


const longestStr = (string) => {
  let str = string.split(" ");
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].length > result.length) {
      result = str[i];
    }
  }
  return result;
};

console.log(longestStr("Saya sangat senang mengerjakan soal algoritma"));

//3 Terdapat dua buah array yaitu array INPUT dan array QUERY, silahkan tentukan berapa kali kata dalam QUERY terdapat pada array INPUT
let input = ["xc", "dz", "bbb", "dz"];
let query = ["bbb", "ac", "dz"];

const findDuplicate = (input, query) => {
    let output = []
    
    query.forEach(val => {
        let countExist = input.filter((ipt)=>{
            return ipt === val
        }).length
        output.push(countExist)
    });
return output
}

console.log(findDuplicate(input, query))



//4 . Silahkan cari hasil dari pengurangan dari jumlah diagonal sebuah matrik NxN Contoh:
let maxtrix = [[1, 2, 0,3], [4, 5, 6,7], [7, 8, 9,2],[3,7,8,9]]
// diagonal pertama = 1 + 5 + 9 = 15 
// diagonal kedua = 0 + 5 + 7 = 12 

// maka hasilnya adalah 15 - 12 = 3

 
 const sumUpDiagonals = (matrix) => {
   let sumDiagonals = 0
   let sumDiagonalsSecond = 0
     matrixLength = matrix.length;
 
   for (let i = 0; i < matrixLength; i++) {
     sumDiagonals += matrix[i][i];
     sumDiagonalsSecond += matrix[i][matrixLength-i-1];
   }
   return sumDiagonals - sumDiagonalsSecond
 }
 
 console.log(sumUpDiagonals(maxtrix))

