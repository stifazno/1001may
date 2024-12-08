import './globals.css'
import Header from './components/Header'
import Footer from "./components/Footer";



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
