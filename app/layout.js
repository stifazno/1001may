import './globals.css'
import Header from './components/Header'
import Footer from "./components/Footer";
import Search from './components/Search';

export default function RootlaYout({children}){
  return(
    <html lang = "en">
        <body>
          <main>
            <Header />
            
            {children}
          </main>
          
         
            <Footer />
         
          
        </body>
        
          
        
    </html>
  )
}
