export class DataSchema{
    defaultmessage: string = '06X4itpARm63UCSn7j1r';
  
    genHexString(len: any) {
        const hex = '0123456789abcdef';
        let output = '';
        for (let i = 0; i < len; ++i) {
            output += hex.charAt(Math.floor(Math.random() * hex.length));
        }
        return output;
      }
    
      generateSalt () {
        const hex = '0123456789abcdef';
        let output = '';
        for (let i = 0; i < 11; ++i) {
            output += hex.charAt(Math.floor(Math.random() * hex.length));
        }
        return output;
      }
}