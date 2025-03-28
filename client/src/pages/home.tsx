import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary">Websites.co.in</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Build your website with <span className="text-primary">drag-and-drop</span>
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Create stunning websites easily with our intuitive drag-and-drop builder. No coding required.
            </p>
            <div className="mt-8">
              <Link href="/builder">
                <Button size="lg" className="px-8 py-3 text-lg">Start Building</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80" 
              alt="Website builder interface" 
              className="w-full h-auto object-cover"
            />
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transform your ideas into reality</h3>
              <p className="text-gray-600 mb-6">
                Our powerful website builder gives you full control over your design. Drag and drop elements, customize properties, and see changes in real-time.
              </p>
              <Link href="/builder">
                <Button variant="secondary">Try the Builder</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Simple drag-and-drop interface makes website building accessible to everyone, regardless of technical skills.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Customizable Templates</h3>
              <p className="text-gray-600">
                Choose from a variety of professionally designed templates and customize them to match your brand.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-gray-600">
                All websites built with our tool are automatically responsive and look great on any device.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Websites.co.in</h3>
            <p className="mb-6">The easiest way to build professional websites</p>
            <p className="text-gray-400 text-sm">© 2023 Websites.co.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
