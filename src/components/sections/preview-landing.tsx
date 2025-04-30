import Image from 'next/image';

import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

export default function PreviewLanding() {
    return (
        <MaxWidthWrapper large={true} className="border-dashed min-[1400px]:border-x">
            <div className="pb-6 sm:pb-16">
                <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border max-w-5xl m-auto">
                    <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
                        <Image
                            className="size-full object-cover object-center dark:opacity-85 dark:invert"
                            src="/placeholder.svg?height=550&width=450"
                            alt="preview landing"
                            width={2000}
                            height={1000}
                            priority={true}
                        />
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
