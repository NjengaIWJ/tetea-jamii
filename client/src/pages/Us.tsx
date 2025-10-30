import Contact from "./Contacts";
import Partners from "./Partners";
import Stories from "./Stories";
const Us: React.FC = () => {
	return (
		<>
			<main className="relative bg-[#f8fafc] dark:bg-gray-950 min-h-screen">
				<div className="mx-auto">
					<section className="py-8 sm:py-12 lg:py-16">
						<div className="container mx-auto px-4 sm:px-6 lg:px-8">
							<Stories />
						</div>
					</section>

					<section className="py-8 sm:py-12 lg:py-16 bg-white dark:bg-gray-900">
						<div className="container mx-auto px-4 sm:px-6 lg:px-8">
							<Partners />
						</div>
					</section>

					<section className="py-8 sm:py-12 lg:py-16">
						<div className="container mx-auto px-4 sm:px-6 lg:px-8">
							<Contact />
						</div>
					</section>
				</div>
			</main>
		</>
	);
};

export default Us;
